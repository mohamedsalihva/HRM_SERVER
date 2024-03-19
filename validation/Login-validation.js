const validator = require('validator');
const isEmpty = require('./is_empty');
const users = require('../db/models/users')


module.exports = function validateLogin (data){
     let errors ={};
     console.log("validation file reached");

     data.email = !isEmpty(data.email)? data.email :"";
     data.password = !isEmpty(data.password)? data.password : "";


     if (validator.isEmpty(data.email)){
        errors.email = "email feild is required"
     }

     if(validator.isEmpty(data.password)){
        errors.password = "password feild is required"
     }

     return {
        login_errors : errors,
        login_valid : isEmpty(errors)
     };
}