const validator = require('validator');
const isEmpty = require('./is_empty');
const users = require('../db/models/users');



module.exports = function ValidateEditUser(req){
    let errors ={}
    
    const { name , email ,  address} = req.body;
    
    console.log("validation file reached");
    
    const nameValue = !isEmpty(name)? name : "" ;
    const emailValue = !isEmpty(email)? email : "" ;
    const addressValue = !isEmpty (address)? address :"";
    
    
    if(validator.isEmpty(nameValue)){
        errors.name = " Name feild is required"
    }
    
    
    
  if (validator.isEmpty(emailValue)) {
    errors.email = "Email is required";
  } else if (!validator.isEmail(emailValue)) {
    errors.email = "Invalid email format";
  }

    
    
    if(validator.isEmpty(addressValue)){
        errors.address ="address is required"
    }
    
    return {
        errors : errors,
        isvalid : isEmpty(errors)
     };
    
    
    }