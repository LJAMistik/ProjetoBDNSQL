import express, { Request, Response, request } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authorize } from '../middleware/auth';
import { userValidator } from '../validators/users';

export const authRoutes = express.Router();

authRoutes.post('/', async (req:Request, res:Response) => {
    try {
        const userParams = req.body;

        await userValidator.validate(userParams, {abortEarly: false});

        const emailAlreadyExist = await User.findOne({email: userParams.email});

        if(emailAlreadyExist) {
            res.status(400).json({
                message: `Email already exists`
            });
            return;
        }
        const password = await bcrypt.hash(userParams.password, 10);

        await User.create({
            ...userParams,
            password
        });

        res.status(201).json({
            success: true,
            message: "User Created"
        });
        return;
    } catch (error:any) {
        console.log(error.errors);
        
        res.status(400).json({
            message: error.message.toString(),
            errors: error.errors ?? undefined
        })
    }
})

authRoutes.post('/login', async (req:Request, res:Response) => {
    try {
        const {email, password} = req.body;

        const userExist = await User.findOne({email});

        const isPasswordMatched = userExist ? await bcrypt.compare(password, userExist.password) : false;


        if(!userExist || !isPasswordMatched) {
            res.status(400).json({
                message: `Incorrect  email or password`
            });
            return;
        }

        const token = jwt.sign(
            {
              _id: userExist._id,
              name: userExist.name,
              email: userExist.email,
              birthday: userExist.birthday,
              createdAt: userExist.createdAt,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "Login success",
            token
        });
        return;

    } catch (error:any) {
        console.log(error);
        res.status(400).json({
            message: error.message.toString()
        })
    }
})

authRoutes.get('/', authorize, async (req:Request, res:Response) => {
    try {
        res.status(200).json(req.body.auth);
        return;
    } catch (error:any) {
        console.log(error);
        res.status(400).json({
            message: error.message.toString()
        })
    }
})

authRoutes.put('/', authorize, async (req:Request, res:Response) => {
    try {
       const {name, email, birthday} = req.body;
       let password: string | undefined;

       if (req.body.password) {
        password = await bcrypt.hash(req.body.password, 10)
       }

       const updatedUser = await User.findByIdAndUpdate(
        req.body.auth._id,
        password ? {name, email, birthday, password} : {name, email, birthday}
       );

       if (!updatedUser) {
        res.status(404).json({
            message: "User not found"
        })
        return
       }

       const token = jwt.sign(
            {
            _id: req.body.auth._id,
            name, 
            email, 
            birthday,
            createdAt: updatedUser.createdAt,
            },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            success: true,
            message: "User updated",
            token
        })
        return;

    } catch (error:any) {
        console.log(error)
        res.status(400).json({
            message: error.message.toString()
        })
    }
})

authRoutes.delete('/', async (req:Request, res:Response) => {
    try {
        const userExist = await User.findById(req.body._id);

        if (!userExist) {
            res.status(404).json({
                message: "User not found"
            })
        }

        await User.deleteOne({_id: req.body._id});
        
        res.status(200).json({
            success: true,
            message: "User deleted"
        })
        return;
    } catch (error:any) {
        console.log(error)
        res.status(400).json({
            message: error.message.toString()
        })
    }
})