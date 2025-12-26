const jwt = require('jsonwebtoken')
const userModel = require("../models/user-model")
const OwnerModel = require("../models/owners-model")

module.exports = async function(req,res,next){
    try{
        let owner = await OwnerModel.findOne()
        let decoded = jwt.verify(req.cookies.token,process.env.JWT_KEY)
        if(decoded.id===owner.id){
            next()
        }
        else{
            req.flash("error","I am Sure.. You are not an Admin")
            res.redirect("/shop")
        }
    }
    catch(err){
        res.send(err)
    }
}