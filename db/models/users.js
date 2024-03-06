const mongoose = require('mongoose');

const users = mongoose.Schema({

    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    }
});

module.exports =  mongoose.model("user_colls",users);