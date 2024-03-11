const users = require('../db/models/users');
const success_function = require('../utils/response_handlers').success_function;
const error_function = require('../utils/response_handlers').error_function;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async function(req, res) {
  
  try {
    let email = req.body.email
    let password = req.body.password
   


   function validateEmail(){
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
   }

   if(!validateEmail(email)){
    return res.status(400).send("invalid email format")
   }

   
   function validatePassword(){
      return password.length >= 8;
   }

  if(!validatePassword(password)){
    return res.status(400).send("invalid password");
  }


  const user = await users.findOne({ email });

    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }


    const comparepassword = bcrypt.compare(password,user.password);
    if (!comparepassword) {
        return res.status(401).json({ error: 'Invalid password' });
    }

    
    const token = jwt.sign({}, process.env.JWT_SECRET,);

    const response = success_function({
      statusCode: 200,
      data:token,
      message:"login success",
      
    })
   
    res.status(response.statusCode).send(response);
    return;

} catch (error) {
    console.error(error);
    let response = error_function({
      statusCode: 500,
      message: "Something went wrong",
    });
    res.status(response.statusCode).send(response);
    }
  
}