const joi = require('joi')

const validator = (schema) => {
    return (req,res,next) => {
        const { error } = schema.validate(req.body,{abortEarly : false});
    if(error){
        req.flash("error",error.details[0].message)
        return res.redirect("/")
    }
    next();
    }
}

module.exports = validator;