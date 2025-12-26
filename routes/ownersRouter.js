const express = require('express')
const router = express.Router()
const multer = require('multer')
const ownerModel = require('../models/owners-model')
const productModel = require('../models/product-model')
const isloggedIn = require('../middlewares/isloggedIn')
const userModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const {generateToken} = require("../utils/generateToken")
const isOwner = require('../middlewares/isOwner')

if(process.env.NODE_ENV === "development"){
    router.post("/create",async (req,res)=>{
    let owner = await ownerModel.find()
    if(owner.length>0){
        return res
        .status(500)
        .send("You dont have permission to create Owner")
    }

    let {name,email,password} = req.body

    let createdOwner = await ownerModel.create({
        name,
        email,
        password
    })
    res.status(200).send(createdOwner)
})  
}
router.post("/create", async (req, res) => {
    const ownerExists = await ownerModel.findOne()

    if (ownerExists) {
        return res.status(403).send("Owner already exists")
    }

    const { name, email, password } = req.body

    const createdOwner = await ownerModel.create({
        name,
        email,
        password
    })

    res.status(201).json(createdOwner)
})


router.get("/admin",isloggedIn,isOwner,async(req,res)=>{
    let user = await userModel.findOne({_id:req.user.id})
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("createProduct",{user,success,error})
})

router.get("/admin/login",async(req,res)=>{
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("admin-login",{error,success})
})

router.post("/admin/login",async(req,res)=>{
    try{
        let {email,password} = req.body
        let owner = await ownerModel.findOne({email})
        if(!owner) {
            req.flash("error","Incorrect Email or Password")
            return res.redirect("/owners/admin/login")
        }
        if(password===owner.password){
            let token = generateToken(owner)
            res.cookie("token",token)
            res.redirect("/products/admin")
        }
        else{
            req.flash("error","Incorrect Email or Password")
            return res.redirect("/owners/admin/login")
        }
    }
    catch (err){
        req.flash("error",err.message)
        return res.redirect("/owners/admin/login")
    }
})


module.exports = router