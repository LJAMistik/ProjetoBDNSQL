import * as yup from "yup";
import { ContactType } from "../enums/ContactType";


export const contactValidator = yup.object().shape({
    contact: yup.string().required(),
    contactType: yup.string().required()
})