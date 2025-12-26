const express = require('express')
const router = express.Router()
const multer = require('multer')
const ownerModel = require('../models/owners-model')
const productModel = require('../models/product-model')
const isloggedIn = require('../middlewares/isloggedIn')
const userModel = require('../models/user-model')

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

router.get("/admin",isloggedIn,async(req,res)=>{
    let user = await userModel.findOne({_id:req.user.id})
    let error = req.flash("error")
    let success = req.flash("success")
    res.render("createProduct",{user,success,error})
})

module.exports = router