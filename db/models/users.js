const mongoose = require('mongoose');

const users = mongoose.Schema({
     name:{
        type:String,
        required:true,
        unique:true
     },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    address:{
        type:String,
        

    }
});

module.exports =  mongoose.model("users",users);