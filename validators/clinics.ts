import * as yup from 'yup'
import { contactValidator } from './contact'
import { adressValidator } from './adress'

const clinicValidator = yup.object().shape({
    name: yup.string().required().min(3).max(100),
    email: yup.string().email().required(),
    phone: yup.string().required(),
    rating: yup.number().required(),
    adress: adressValidator
})