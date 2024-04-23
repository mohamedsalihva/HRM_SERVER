const users = require('../db/models/users');
const success_function = require('../utils/response_handlers').success_function;
const error_function = require('../utils/response_handlers').error_function;
const validateLogin = require('../validation/Login-validation');
const jwt = require('jsonwebtoken');
const sendEmail = require("../utils/send-Email").sendEmail;
const resetPassword = require('../utils/email-templates/reset-password').resetPassword
const bcrypt = require('bcryptjs');

exports.login = async function (req, res) {
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

exports.forgotPassword = async function (req, res) {
  try {
    let email = req.body.email;

    if (email) {
      let user = await users.findOne({ email: email });
      // console.log("user:",user)
      if (user) {
        let reset_token = jwt.sign(
          { user_id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "10m" }
        );
        // console.log("reset_token:",reset_token)
        let data = await users.updateOne(
          { email: email },
          { $set: { password_token: reset_token } }

        );

        //console.log("data:",data)

        if (data.matchedCount === 1 && data.modifiedCount == 1) {
          let reset_link = `${process.env.FRONTEND_URL}/reset-password?token=${reset_token}`;
          let email_template = await resetPassword(user.name, reset_link);
          sendEmail(email, "Forgot password", email_template);
          let response = success_function({
            statusCode: 200,
            message: "Email sent successfully",
          });
          res.status(response.statusCode).send(response);
          return;
        } else if (data.matchedCount === 0) {
          let response = error_function({
            statusCode: 404,
            message: "User not found",
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
      } else {
        let response = error_function({ statusCode: 403, message: "Forbidden" });
        res.status(response.statusCode).send(response);
        return;
      }
    } else {
      let response = error_function({
        statusCode: 422,
        message: "Email is required",
      });
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
    if (process.env.NODE_ENV == "production") {
      let response = error_function({
        statusCode: 400,
        message: error
          ? error.message
            ? error.message
            : error
          : "Something went wrong",
      });

      res.status(response.statusCode).send(response);
      return;
    } else {
      let response = error_function({ statusCode: 400, message: error });
      res.status(response.statusCode).send(response);
      return;
    }
  }
};


exports.resetPassword = async function (req, res) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];

    let password = req.body.password;
    let confirmPassword = req.body.confirmPassword;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      const response = {
        statusCode: 400,
        message: "Password and confirm password do not match"
      };
      return res.status(response.statusCode).json(response);
    }

    // Decode the token to get the user ID
    const decoded = jwt.decode(token);

    //console.log("Decoded user ID:", decoded.user_id);
    //console.log("Token:", token);


    // Find the user based on user ID and token

    let user = await users.findOne({
      $and: [{ _id: decoded.user_id }, { password_token: token }]
    });

    //console.log("user:", user);


    if (user) {
      // Hash the new password
      let salt = bcrypt.genSaltSync(10);
      let password_hash = bcrypt.hashSync(password, salt);

      // Update the user's password and clear the password token
      let data = await users.updateOne(
        { _id: decoded.user_id },
        { $set: { password: password_hash, password_token: null } }
      );
      //console.log("data:", data)
      // Check if the password was updated successfully
      if (data.matchedCount === 1 && data.modifiedCount === 1) {
        const response = {
          statusCode: 200,
          message: "Password changed successfully"
        };
        return res.status(response.statusCode).json(response);
      } else {
        const response = {
          statusCode: 400,
          message: "Password reset failed"
        };
        return res.status(response.statusCode).json(response);
      }
    } else {
      const response = {
        statusCode: 403,
        message: "Forbidden"
      };
      return res.status(response.statusCode).json(response);
    }
  } catch (error) {
    console.log("Error:",error)
    if (process.env.NODE_ENV === "production") {
      const response = {
        statusCode: 400,
        message: error.message ? error.message : "Something went wrong"
      };
      return res.status(response.statusCode).json(response);
    } else {
      const response = {
        statusCode: 400,
        message: error.message ? error.message : error
      };
      return res.status(response.statusCode).json(response);
    }
  }
};
