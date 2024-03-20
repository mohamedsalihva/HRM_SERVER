const validator = require('validator');
const isEmpty = require('./is_empty');
const users = require('../db/models/users');


module.exports = function ValidateAdduser(req){
let errors ={}

const { name , email , password , address} = req.body;

console.log("validation file reached");

const nameValue = !isEmpty(name)? name : "" ;
const emailValue = !isEmpty(email)? email : "" ;
const passwordValue = !isEmpty(password) ? password : "" ;
const addressValue = !isEmpty (address)? address :"";


if(validator.isEmpty(nameValue)){
    errors.name = " Name feild is required"
}

if(validator.isLength(nameValue,{ min:2, max:30})){
    errors.name = "name must be between 2 and 30"
}



if(validator.isEmail(emailValue)){
    errors.email="email  is required"
}



if(validator.isEmpty(passwordValue)){
    errors.password = "password is required"
}


if(validator.isEmpty(addressValue)){
    errors.address ="address is required"
}

return {
    errors : errors,
    isvalid : isEmpty(errors)
 };


}