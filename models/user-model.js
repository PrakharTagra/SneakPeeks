const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const defaultprofile = fs.readFileSync(
    path.join(__dirname,"../public/images/user-circles-set.png")
)

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    contact: Number,
    Address: String,
    profile: {
        type: Buffer,
        default: defaultprofile
    },
    cart: {
        type : Array,
        default: []
    },
    orders:[{
        type : Array,
        default: []
    }],
})

module.exports = mongoose.model("user",userSchema)