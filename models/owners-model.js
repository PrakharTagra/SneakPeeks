const mongoose = require('mongoose')

const ownerSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    contact: Number,
    profile: String,
    gstin : String,
    products: {
        type : Array,
        default: []
    },
})

module.exports = mongoose.model("owner",ownerSchema)