import Joi from "joi";

const intakeValidationSchema = Joi.object({
    fullName:Joi.string()
    .min(3)
    .max(100)
    .required(),

    email:Joi.string()
    .email()
    .required(),

    phone:Joi.string()
    .min(10)
    .max(15)
    .required(),

    serviceType:Joi.string()
    .required(),

    budget:Joi.string()
    .required(),

    projectDescription:Joi.string()
    .min(10)
    .required(),
    user: Joi.string().required()
});

export default intakeValidationSchema;