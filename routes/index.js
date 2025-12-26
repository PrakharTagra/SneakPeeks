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

router.get("/cart",isloggedIn, async (req,res)=>{
    let user = await userModel.findOne({_id:req.user.id}).populate("cart.product")
    let error = req.flash("error")
    let success = req.flash("success")

    let i
    let subtotal = 0
    for(i=0;i<user.cart.length;i++){
        subtotal+=(user.cart[i].product.discount*user.cart[i].quantity)
    }
    res.render("cart",{user,error,success,subtotal})
})

router.get("/addtocart/:id",isloggedIn,async(req,res)=>{
    try{
        let user = await userModel.findOne({_id:req.user.id})
        let product = await productModel.findOne({_id:req.params.id})
        user.cart.push({product:product._id,quantity: 1})
        await user.save()
        req.flash("success","Product added to Cart")
        res.redirect("/cart")
    }
    catch(err){
        req.flash("error",err.message)
        res.redirect("/shop")
    }
})

router.get("/cart/increase/:id",isloggedIn,async(req,res)=>{
    try{
        let user = await userModel.findOne({_id:req.user.id})
        const item = user.cart.find(item=>item._id.toString()===req.params.id)
        if(item){
            item.quantity+=1
        }
        await user.save()
        req.flash("success","Quantity Increased")
        res.redirect("/cart")
    }
    catch(err){
        req.flash("error",err.message)
        res.redirect("/cart")
    }
})

router.get("/cart/decrease/:id",isloggedIn,async(req,res)=>{
    try{
        let user = await userModel.findOne({_id:req.user.id})
        const item = user.cart.find(item=>item._id.toString()===req.params.id)
        if(item){
            if(item.quantity>1){
                item.quantity-=1
            }
            else if(item.quantity==1){
                const index = user.cart.findIndex(item=>item._id.toString()===req.params.id)
                user.cart.splice(index,1)
                await user.save()
            }
        }
        await user.save()
        req.flash("success","Quantity Decreased")
        res.redirect("/cart")
    }
    catch(err){
        req.flash("error",err.message)
        res.redirect("/cart")
    }
})

router.get("/cart/remove/:id",isloggedIn,async(req,res)=>{
    try{
        let user = await userModel.findOne({_id:req.user.id})
        const item = user.cart.find(item=>item._id.toString()===req.params.id)
        if(item){
            const index = user.cart.findIndex(item=>item._id.toString()===req.params.id)
            user.cart.splice(index,1)
            await user.save()
        }
        req.flash("success","Item Removed")
        res.redirect("/cart")
    }
    catch(err){
        req.flash("error",err.message)
        res.redirect("/cart")
    }
})

module.exports = router;