import * as yup from "yup";

export const adressValidator = yup.object().shape({
    zipCode: yup.string().required().length(9),
    street: yup.string().required(),
    number: yup.number().required().max(5),
    neighborhood: yup.string().required().min(3),
    city: yup.string().required(),
    state: yup.string().required().max(2)
})