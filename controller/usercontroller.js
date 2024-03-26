const users = require('../db/models/users');
const success_function = require('../utils/response_handlers').success_function;
const error_function = require('../utils/response_handlers').error_function;
const bcrypt = require('bcrypt');
const AddUserValidation = require('../validation/AddUser-validation');

exports.Adduser = async function(req, res) {
  try {
    const { errors, isValid } = await AddUserValidation(req);

    if (!isValid) {
      let response = {
        success: false,
        statusCode: 400,
        message: "Validation failed",
        errors: errors
      };
      return res.status(400).json(response);
    }

    const { name, email, address } = req.body;

    let user = await users.findOne({ email });

    if (user) {
      let response = error_function({
        statusCode: 400,
        message: "User already exists",
      });
      return res.status(response.statusCode).send(response);
    }

    
    let randomPassword = generateRandomPassword(12);
    let salt = bcrypt.genSaltSync(10);
    let hashed_password = await bcrypt.hashSync(randomPassword, salt);

    let new_user = await users.create({
      name,
      email,
      password: hashed_password, 
      address,
      user_type: "65f93a85a44207acf7b2777e"
    });

    if (new_user) {
      let response = success_function({
        statusCode: 201,
        data: new_user,
        message: "User created successfully",
      });
      return res.status(response.statusCode).send(response);
    } else {
      let response = error_function({
        statusCode: 400,
        message: "User creation failed",
      });
      return res.status(response.statusCode).send(response);
    }
  } catch (error) {
    console.log("error : ", error);
    let response = error_function({
      statusCode: 500,
      message: "Internal server error",
    });
    return res.status(response.statusCode).send(response);
  }
};

function generateRandomPassword(length) {
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
  let password = "";
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}
