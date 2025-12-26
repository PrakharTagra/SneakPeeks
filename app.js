const express = require('express')
const app = express()
const cookieParser  = require('cookie-parser')
const path = require('path')
const db = require("./config/mongoose-connection")
const ownersRouter = require('./routes/ownersRouter')
const usersRouter = require('./routes/usersRouter')
const productsRouter = require('./routes/productsRouter')
require('dotenv').config()
const session = require('express-session')
const flash = require('connect-flash')

app.set("view engine","ejs")
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(
    session({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        // cookie: { secure: true }
    })
)
app.use(flash())

app.use("/owners",ownersRouter)
app.use("/users",usersRouter)
app.use("/products",productsRouter)

const indexRoute = require('./routes/index')
app.use("/",indexRoute)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});