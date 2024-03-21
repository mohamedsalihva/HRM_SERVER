const validator = require('validator');
const isEmpty = require('./is_empty');
const users = require('../db/models/users');

module.exports = async function ValidateAdduser(req) {
    let errors = {};

    const { name, email, password, address } = req.body;
    
    console.log("Validation file reached");

    const nameValue = !isEmpty(name) ? name : "";
    console.log("Name:", nameValue);
  
    
    const emailValue = !isEmpty(email) ? email : "";
    console.log("Email:", emailValue);

    const passwordValue = !isEmpty(password) ? password : "";
    console.log("Password:", passwordValue);

    const addressValue = !isEmpty(address) ? address : "";
   console.log("Address:", addressValue);


    if (validator.isEmpty(nameValue)) {
        errors.name = "Name field is required";
    }

    if (!validator.isLength(nameValue, { min: 2, max: 30 })) {
        errors.name = "Name must be between 2 and 30 characters";
    }

    if (!validator.isEmail(emailValue)) {
        errors.email = " email is required";
    }else{
    
            const emailCount = await users.countDocuments({ email: emailValue });
            if (emailCount > 0) {
                errors.email = "Email already exists";
            }

    }


    if (validator.isEmpty(passwordValue)) {
        errors.password = "Password is required";
    }

    if (validator.isEmpty(addressValue)) {
        errors.address = "Address is required";
    }

    return {
        errors: errors,
        isValid: isEmpty(errors),
    };
};
