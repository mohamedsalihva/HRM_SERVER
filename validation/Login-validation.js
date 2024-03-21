const validator = require('validator');
const isEmpty = require('./is_empty');
const users = require('../db/models/users')


module.exports = function validateLogin (req){
   

   
     let errors ={};

     const { email , password} = req.body;

     console.log("validation file reached");

     const emailValue = !isEmpty(email)? email :"";
     const passwordValue = !isEmpty(password)? password : "";


     if (validator.isEmpty(emailValue)){
        errors.email = "email feild is required"
     }

     if(validator.isEmpty(passwordValue)){
        errors.password = "password feild is required"
     }

     return {
        login_errors : errors,
        login_valid : isEmpty(errors)
     };
}