import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../models/user";

export const authorize = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const token = req.headers.authorization!.split(' ')[1];

        const { _id, name, email, birthday, createdAt } = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as any

        const userExist = await User.findOne({ _id, name, email, birthday, createdAt });
        if(!userExist) {
            throw new Error('Not authenticated');
        }
        req.body.auth = userExist;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authenticated'
        });
        return;
    }
}