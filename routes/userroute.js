const express = require("express");
const router = express.Router();
const accessControl = require('../utils/access-control').accessControl
const usercontroller =require('../controller/usercontroller')

 const setAccessControl = (access_type) =>{
    return( req, res, next)=>{
        accessControl(access_type,req,res,next)
    }
 };

router.post('/users',setAccessControl('1'),usercontroller.Adduser);
router.get('/users',usercontroller.ViewList);
router.put('/users',usercontroller.UpdateUser);
router.delete('/users',usercontroller.DeleteUser);
module.exports=router;