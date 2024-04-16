const users = require('../db/models/users');
const success_function = require('../utils/response_handlers').success_function;
const error_function = require('../utils/response_handlers').error_function;
const validateLogin = require('../validation/Login-validation');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

exports.login = async function(req, res) {
  try {
    const { login_errors, login_valid } = validateLogin(req);

    if (!login_valid) {
      let response = error_function({
        statusCode: 400,
        message: "Validation failed",
        login_errors
      });
      return res.status(response.statusCode).send(response);
    }

    let email = req.body.email;
    let password = req.body.password;

    console.log("Email:", email);
    console.log("Password:", password);

    const user = await users.findOne({ email });

    console.log("User:", user);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.password !== password) {
      console.error("Invalid password:", password);
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET);

    const response = success_function({
      statusCode: 200,
      data: token,
      message: "Login successful"
    });

    res.status(response.statusCode).send(response);
  } catch (error) {
    console.error(error);
    let response = error_function({
      statusCode: 500,
      message: "Something went wrong"
    });
    res.status(response.statusCode).send(response);
  }
};
