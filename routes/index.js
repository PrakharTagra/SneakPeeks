const express = require('express')
const router = express.Router()
const isloggedIn = require("../middlewares/isloggedIn")
const productModel = require('../models/product-model')
const userModel = require('../models/user-model')

router.get("/",(req,res)=>{
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("index",{error,success}) 
})

router.get("/shop",isloggedIn,async (req,res)=>{
    let user = await userModel.findOne({_id:req.user.id})
    let error = req.flash("error")
    let success = req.flash("success")
    let products = await productModel.find()
    res.render("shop",{products,user,error,success})
})

router.get("/about",isloggedIn,async (req,res)=>{
    let user = await userModel.findOne({_id:req.user.id})
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("about",{user,error,success})
})

module.exports = router;