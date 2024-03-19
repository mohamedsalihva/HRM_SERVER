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
    
    },
    user_type:{ type :mongoose.Schema.Types.ObjectId, ref:"user_types"}
});

module.exports =  mongoose.model("users",users);