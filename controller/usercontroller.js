const users = require('../db/models/users');
const success_function = require('../utils/response_handlers').success_function;
const error_function = require('../utils/response_handlers').error_function;
const bcrypt = require('bcrypt');
const AddUserValidation = require('../validation/AddUser-validation');
const EditUserValidation = require('../validation/EditUser-validation');




exports.Adduser = async function(req, res) {
  try {

    const { errors, isValid } = await AddUserValidation(req);

    if (!isValid) {
        let response = {
            success: false,
            statusCode: 400,
            message: "Validation failed",
          
        };
        response.errors = errors;
        return res.status(400).json(response);
    }


   const {name,email,password,address} = req.body
  
    let user = await users.findOne({email});

    if(user) {
        let response = error_function({

            statusCode : 400,
            message : "User already existed",
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
      password: hashed_password,
      address,
    
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
};


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

    
const {errors, isvalid}  = EditUserValidation(req);


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


exports.DeleteUser = async (req,res)=>{
   try {
     let data = req.body;
     console.log("data:",data);

    let finalData = {
      name:data.name,
      email:data.email,
      password:data.password,
      address:data.address
    }

    let id = data.id;
    console.log("id:",id);
    console.log("typeOf(id) : ",typeof(id));


    let deletedUser = await users.deleteOne({id},{$set :finalData});

    let response = success_function({
      statusCode: 200,
      data: deletedUser,
      message: "User deleted successfully",
    })

   error_function({
      statusCode: 404,
      message: "User not found",
    });

res.status(response.statusCode).send(response);


} catch (error) {
console.log("error : ", error);
let response = error_function({
  statusCode: 500,
  message: "Something went wrong",
});
res.status(response.statusCode).send(response);
}
}



