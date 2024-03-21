const users = require('../db/models/users');
const success_function = require('../utils/response_handlers').success_function;
const error_function = require('../utils/response_handlers').error_function;
const validateLogin = require('../validation/Login-validation')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async function(req, res) {
  
  try {
     
    const {login_errors , login_valid} = validateLogin(req);

    if(!login_valid){

       let response = error_function({
        statusCode:400,
        message: "validation failed"
       });
       response.login_errors = login_errors;
      return res.status(response.statusCode).send(response);
    }



    let email = req.body.email
    let password = req.body.password
   


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
      message:"login successs",
      
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