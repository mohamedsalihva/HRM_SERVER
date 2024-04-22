const users = require('../db/models/users');
const success_function = require('../utils/response_handlers').success_function;
const error_function = require('../utils/response_handlers').error_function;
const bcrypt = require('bcryptjs');
const AddUserValidation = require('../validation/AddUser-validation');
const ValidateEditUser = require('../validation/EditUser-validation');
const set_pass_template = require("../utils/email-templates/set-password").resetPassword;
const sendEmail = require ("../utils/send-Email").sendEmail;

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

    
    let Password = generateRandomPassword(12);
    let salt = bcrypt.genSaltSync(10);
    let hashed_password = await bcrypt.hashSync(Password, salt);

    let new_user = await users.create({
      name,
      email,
      password: hashed_password, 
      address,
      user_type: "65f93a85a44207acf7b2777e"
    });

    if (new_user) {
      let emailContent = await set_pass_template(name,email,Password);
       console.log("reahged here") 

      await sendEmail(email, "set your password",emailContent);
         console.log("email : ", email)
        //  console.log("email reached")

      let response_datas = {
          _id : new_user._id,
          name : new_user.name,
          email : new_user.email,
          address : new_user.address,
          user_type : "65f93a85a44207acf7b2777e"
         
      }
      
      console.log("new_user : ",new_user);

      let response = success_function({
          statusCode : 201,
          data : response_datas,
          message : "user created successfully",
      })
      res.status(response.statusCode).send(response);
      return ;
  }else {
      let response = error_function({
          statusCode : 400 ,
          message : "user creation failed",
      })
      res.status(response.statusCode).send(response);
      return ;
  }
}catch (error) {
  console.log("error : ",error);

  let response = error_function ({
      statusCode : 400 , 
      message : "something went wrong..."
  })
  res.status(response.statusCode).send(response);
  return ;
}
}

function generateRandomPassword(length) {
  let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$";
  let password = "";
  for (let i = 0; i < length; i++) {
    let randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }
  return password;
}





exports.ViewList = async function (req,res){
  try {
    let allUsers = await users.find();
     
    if (allUsers.length>0){
      let response= success_function({
        statusCode: 200,
        data: allUsers,
        message: "Users retrieved successfully"
      })
      res.status(response.statusCode).send(response);
      return;

    }else{
      let response =error_function({
        statusCode:400,
        message:"user not found"
      })
      res.status(response.statusCode).send(response);
      return;
    }
  } catch (error) {
    console.log("error:",error);
    let response= error_function({
      statusCode:401,
      message:"something went wrong"
    });
    res.status(response.statusCode).send(response);
    return;

  }
}




exports.UpdateUser = async (req, res) => {
  try {

    
const {errors, isvalid}  = ValidateEditUser(req);


if(!isvalid){
  let response = error_function({
     statusCode:400,
     message:"validation failed"
  });
  response.errors = errors;
  return res.status(response.statusCode).send(response);
}




    const data = req.body;
    console.log("data:", data);
    
    const finalData = {
      name: data.name,
      email: data.email,
      password: data.password,
      address: data.address
    };

    const userId = data.id;
    console.log("id : ", userId);

    const updatedUser = await users.findByIdAndUpdate(userId, finalData, { new: true });

    if (!updatedUser)  {
      return res.status(404).json({ message: "User not found" });
    }
    

    return res.status(200).json({
      statusCode: 200,
      data: updatedUser,
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ statusCode: 500, message: "Something went wrong" });
  }
};

exports.DeleteUser = async (req, res) => {
  try {
    let data = req.body;
    console.log("data:", data);

    let userId = data._id;
    console.log("userId:", userId);
    console.log("typeOf(userId) : ", typeof(userId));

    let deletedUser = await users.deleteOne({ _id: userId });
    console.log("deletedUser:",deletedUser)

    if (deletedUser.deletedCount === 1) {
      let response = {
        success: true,
        statusCode: 200,
        data: deletedUser,
        message: "User deleted successfully",
      };
      res.status(response.statusCode).send(response);
    } else {
      let response = {
        success: false,
        statusCode: 404,
        data: null,
        message: "User not found",
      };
      res.status(response.statusCode).send(response);
    }

  } catch (error) {
    console.log("error:", error);
    let response = {
      success: false,
      statusCode: 500,
      message: "Something went wrong",
    };
    res.status(response.statusCode).send(response);
  }
};
