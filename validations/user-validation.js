const joi = require('joi')

const registerSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    contact: joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
      "string.pattern.base": "Enter a valid 10-digit mobile number",
      "any.required": "Mobile number is required"
    }),
    password: joi.string().min(3).max(10).required()
})

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(3).max(10).required()
})

module.exports = {registerSchema,loginSchema}