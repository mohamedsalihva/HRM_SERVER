const users = require('../db/models/users');
const success_function = require('../utils/response_handlers').success_function;
const error_function = require('../utils/response_handlers').error_function;
const validateLogin = require('../validation/Login-validation');
const jwt = require('jsonwebtoken');
const sendEmail = require ("../utils/send-Email").sendEmail;
// const resetPassword = require('../utils/email-templates/reset-password')
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

exports.forgotpassword = async function(req, res) {
  try {
    let email = req.body.email;
    if (!email) {
      let response = error_function({
        statusCode: 400,
        message: "Email is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let user = await users.findOne({ email });
    if (!user) {
      let response = error_function({
        statusCode: 404,
        message: "User not found",
      });
      res.status(response.statusCode).send(response);
      return;
    }

    let reset_token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: "10min" });
    // console.log("user:",user)
    let data = await users.updateOne({ email }, { $set: { password_token: reset_token } });
    

    if (data.matchedCount === 1 && data.modifiedCount === 1) {
      let reset_link = `${process.env.FRONTEND_URL}/reset-password?token=${reset_token}`;
      let email_template = await resetPassword(user.name, reset_link);
      await sendEmail(email, "forgotpassword", email_template);
      
      let response = success_function({
        statusCode: 200,
        message: "Email sent successfully",
      });
      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({
        statusCode: 400,
        message: "Password reset failed",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
    if (process.env.NODE_ENV == "production") {
      let response = error_function({
        statusCode: 400,
        message: error.message || "Something went wrong",
      });
      res.status(response.statusCode).send(response);
    } else {
      let response = error_function({ statusCode: 400, message: error });
      res.status(response.statusCode).send(response);
    }
  }
  
};
