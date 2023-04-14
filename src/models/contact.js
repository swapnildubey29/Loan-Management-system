const mongoose = require('mongoose');
const ContactSchema = new mongoose.Schema({
    FName: {
      type : String,
      required : true  
    },
    EmailAddress: {
        type: String,
        required: true,
        unique:true
    },
    Contact : {
        type : Number,
        required : true,
        unique : true
    },
    Subject: {
        type : String,
        required : true  
    },
    Query: {
        type: String,
        required: true
    }

})

const Contact = new mongoose.model("Contact",ContactSchema)
module.exports = Contact;