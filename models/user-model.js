const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    contact: Number,
    isadmin: Boolean,
    profile: Image,
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