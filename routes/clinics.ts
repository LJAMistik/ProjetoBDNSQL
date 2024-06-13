import express, { Request, Response, request } from 'express';
import { Clinic } from '../models/clinics';
import { authorize } from '../middleware/auth';

export const clinicRoutes = express.Router()



clinicRoutes.post('/', authorize, async (req:Request, res:Response) => {
    try {
        const clinicParams = req.body
        
        const clinicAlreadyExists = await Clinic.findOne({name: clinicParams.name, adress: clinicParams.name})

        if (clinicAlreadyExists) {
            res.status(400).json({
                message: "Clinic Already Exists"
            })
        }

        const clinic = await Clinic.create(clinicParams)

        res.status(200).json({
            message: "Clinic created",
            data: clinic
        })

        return
    } catch (error:any) {
        console.log(error);
        
        res.status(400).json({
            message: "Can't create this Clinic",
            errors: error.errors ?? undefined
        })
    }
})

clinicRoutes.get('/', authorize,  async (req:Request, res:Response) => {
    try {
        const allClinics = await Clinic.find({});
        console.log('oi');
        
        res.status(200).json(allClinics)
    } catch (error) {
        console.log(error);
        
        res.status(404).json({
            message: "Can't find"
        })
    }
})

clinicRoutes.put('/:id', authorize, async (req:Request, res:Response) => {
    try {
        const clinicId = req.params.id;

        const clinicParams = req.body
        const updatedClinic = await Clinic.findByIdAndUpdate(clinicId, clinicParams)

        if (!updatedClinic) {
            res.status(404).json({
                message: "Clinic not found"
            })
        }

        res.status(200).json({
            message: "Updated Successfully",
        })
        return
    } catch (error) {
        res.status(400).json({
            message: "Can't Update"
        })
    }
})

clinicRoutes.delete('/:id', authorize, async (req:Request, res:Response) => {
    try {
        const clinicId = req.params.id; 

        const deleteClinic = await Clinic.deleteOne({_id: clinicId})

        if (!deleteClinic) {
            res.status(404).json({
                message: "Clinic not found"
            })
        }

        res.status(200).json({
            message: "Deleted Successfully"
        })
    } catch (error) {
        res.status(400).json({
            message: "Can't delete"
        })
    }
})