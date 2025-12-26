const express = require('express')
const router = express.Router()   
const validator = require('../middlewares/validator')
const isloggedIn = require('../middlewares/isloggedIn')
const userModel = require('../models/user-model')
const upload = require('../config/multer-config')

const {registerUser,loginUser,logoutUser} = require('../controllers/authController')
const {registerSchema,loginSchema} = require('../validations/user-validation')

router.post("/register",validator(registerSchema),registerUser)

router.post("/login",validator(loginSchema),loginUser)

router.get("/logout",isloggedIn,logoutUser)

router.get("/profile",isloggedIn,async(req,res)=>{
    let user = await userModel.findOne({_id:req.user.id})
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("profile",{user,error,success})
})

router.get("/completeprofile",isloggedIn,async(req,res)=>{
    let user = await userModel.findOne({_id:req.user.id})
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("complete-profile",{user,error,success})
})

router.post("/complete-profile",isloggedIn,upload.single('profile'),async(req,res)=>{
    let {name,email,Address,contact} = req.body
    await userModel.findOneAndUpdate({_id:req.user.id},{name,email,contact,profile:req.file.buffer,Address})
    res.redirect("/users/profile")
})

module.exports = router