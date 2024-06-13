import mongoose from "mongoose";
import { number } from "yup";

export const AdressSchema = new mongoose.Schema({
    zipCode: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    neighborhood: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: true
    },
    complement: {
        type: String,
        required: true
    }
})
