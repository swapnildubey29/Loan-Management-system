const mongoose = require('mongoose')
const requestSchema = new mongoose.Schema({
    FName:{   
        type: String,
        required: true
    },
    EmailAddress:{
        type: String,
        required: true,
        unique: true
    },
    Contact:{
        type: Number,
        required: true,
        unique: true
    },
    Amount:{
        type: Number,
        required: true
    },
    InterestRate:{
        type: Number,
        required: true
    },
    Purpose:{
        type: String,
        required: true
    },
})
const Request = new mongoose.model("Request",requestSchema)
module.exports = Request;