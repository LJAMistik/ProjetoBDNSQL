import mongoose from "mongoose";
import { ContactType } from "../enums/ContactType";

export const ContactSchema = new mongoose.Schema({
    contact: {
        type: String,
        required:true
    },
    contactType: {
        type: String,
        enum: ContactType,
        required:true
    }
});