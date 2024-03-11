const users = require('../db/models/users');
const success_function = require('../utils/response_handlers').success_function;
const error_function = require('../utils/response_handlers').error_function;
const bcrypt = require('bcrypt');



exports.Adduser = async function(req, res) {
  try {
   const {name,email,password,address} = req.body
   
    
    let user = await users.findOne({email});

    if(user) {
        let response = error_function({
            statusCode : 400,
            message : "User already exists",
        });
        
        res.status(response.statusCode).send(response);
        return;
    }

    let salt = await bcrypt.genSalt(10);
    console.log("salt:",salt);

    let hashed_password =bcrypt.hashSync(password, salt);
    console.log("hashed_password:",hashed_password)

    let new_user = await users.create({
      name,
      email,
      address,
      password: hashed_password,
    
    });

    if (new_user) {
        console.log("new_user : ", new_user);
        
        let response = success_function({
            statusCode : 201,
            data : new_user,
            message : "User created successfully",
        });
        res.status(response.statusCode).send(response);
        return;
    }else {
        let response = error_function({
            statusCode : 400,
            message : "User creation failed",
        });
        res.status(response.statusCode).send(response);
        return;
    }
  } catch (error) {
    console.log("error : ", error);
    let response = error_function({
      statusCode: 400,
      message: "Something went wrong",
    });
    res.status(response.statusCode).send(response);
    return;
  }
}