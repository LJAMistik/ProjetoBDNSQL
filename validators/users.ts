import * as yup from "yup";

export const userValidator = yup.object().shape({
    name: yup.string().required().min(3),
    email: yup.string().email().required(),
    password: yup.string().required().min(8).max(16)
})