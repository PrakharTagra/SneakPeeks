const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const {generateToken} = require('../utils/generateToken')

module.exports.registerUser = async (req,res)=>{
    try{
        let {name,email,contact,password} = req.body

        let user = await userModel.findOne({email})
        if(user){
            req.flash("error","Email Already Registered")
            return res.redirect("/")
        }

        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(password,salt, async(err,hash)=>{
                if(err) {
                    req.flash("error",err.message)
                    return res.redirect("/")
                }
                else{
                    let user = await userModel.create({
                        name,email,contact,password:hash
                    })
                    let token = generateToken(user)
                    res.cookie("token",token)
                    res.redirect("/shop")
                }
            })
        })
    }
    catch (err){
        req.flash("error",err.message)
        return res.redirect("/")
    }
}

module.exports.loginUser = async (req,res)=> {
    try{
        let {email,password} = req.body
        let user = await userModel.findOne({email})
        if(!user) {
            req.flash("error","Incorrect Email or Password")
            return res.redirect("/")
        }
        
        bcrypt.compare(password, user.password,(err,result)=>{
            if(result){
                let token = generateToken(user)
                res.cookie("token",token)
                res.redirect("/shop")
            }
            else{
                req.flash("error","Incorrect Email or Password")
                return res.redirect("/")
            }
        })
    }
    catch (err){
        req.flash("error",err.message)
        return res.redirect("/")
    }
}

module.exports.logoutUser = (req,res)=>{
    try{
        res.cookie("token","")
        res.redirect("/")
    }
    catch (err){
        req.flash("error",err.message)
        res.redirect("/")
    }
}