const mongoose = require('mongoose')
require('dotenv').config()
const config = require('config')

const dbgr = require('debug')("development:mongoose")

// mongoose
// .connect(`${config.get("MONGODB_URI")}/SneakPeeks`)
// .then(function(){
//     dbgr("Connected")
// })
// .catch(function(err){
//     dbgr(err)
// })

mongoose.connect(process.env.MONGODB_URI)

module.exports = mongoose.connection