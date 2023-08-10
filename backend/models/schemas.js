const Joi = require("joi");


const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const registerSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    position: Joi.string()
});

const emailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

const schemas = {
    registerSchema,
    emailSchema,
    loginSchema,
};

module.exports = schemas