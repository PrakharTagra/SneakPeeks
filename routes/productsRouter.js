const express = require('express')
const router = express.Router()
const productModel = require('../models/product-model')
const userModel = require('../models/user-model')
const isloggedIn = require('../middlewares/isloggedIn')
const upload = require('../config/multer-config')

router.post("/create",upload.single('image'), async (req,res)=>{
    try{let {name,price,discount,bgcolor,panelcolor,textcolor} = req.body
    await productModel.create({
        image:req.file.buffer,
        name,
        price,
        discount,
        bgcolor,
        panelcolor,
        textcolor
    })
    req.flash("success","Product Created Successfully")
    res.redirect("/products/admin")
}
    catch(err){
        req.flash("error",err.message)
        res.redirect("/admin")
    }
})

router.get("/admin",isloggedIn,async (req,res)=>{
    let user = await userModel.findOne({_id:req.user.id})
    let error = req.flash("error")
    let success = req.flash("success")
    let products = await productModel.find()
    res.render("products",{user,products,error,success})
})

router.get("/admin/edit/:id",isloggedIn,async (req,res)=>{
    let user = await userModel.findOne({_id:req.user.id})
    let product = await productModel.findOne({_id:req.params.id})
    res.render("editproducts",{user,product})
})
router.post("/admin/edit/:id",upload.single('image'),async (req,res)=>{
    try{let {name,price,discount,bgcolor,textcolor,panelcolor} = req.body

    const updateData={
        name,price,discount,bgcolor,textcolor,panelcolor
    }

    if (req.file) {
        updateData.image = req.file.buffer;
    }

    await productModel.findOneAndUpdate({_id:req.params.id},updateData)
    
    req.flash("success","Product Updated Successfully")
    res.redirect("/products/admin")}
    catch(err){
        req.flash("error",err.message)
        res.redirect("/products/admin")
    }
})

router.get("/admin/delete/:id", async (req,res)=>{
    try{
        await productModel.findOneAndDelete({_id:req.params.id})
        res.redirect("/products/admin")
    }
    catch(err){
        res.send(err)
    }
})

module.exports = router