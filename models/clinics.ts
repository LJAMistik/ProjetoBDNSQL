import mongoose from "mongoose";
import { AdressSchema, ContactSchema } from "../schemas";
import { Decimal128 } from "mongodb";


const ClinicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: AdressSchema,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
}, {timestamps: true})

export const Clinic = mongoose.model('clinics', ClinicSchema)