const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const clientRoute = require('./routes/client')

const app = express()

app.use(express.json())
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

const URI = 'mongodb+srv://AkshayABK:Akshay1168@cluster0.oqsbi.mongodb.net/CSV?retryWrites=true&w=majority'
mongoose.connect( URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true

}, err =>{
    if(err) throw err 
    console.log("MongoDB Connected Succesfully!!");
})

app.listen(5000, ()=>{
    console.log("Serving on PORT 5000!");
})

app.use('/client', clientRoute)