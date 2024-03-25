const express = require("express");
const router = express.Router();
const accessControl = require('../utils/access-control').accessControl
const usercontroller =require('../controller/usercontroller')

 const setAccessControl = (access_type) =>{
    return( req, res, next)=>{
        accessControl(access_type,req,res,next)
    }
 };

router.post('/Adduser',setAccessControl('1'),usercontroller.Adduser);
router.get('/getuser',usercontroller.ViewList);
router.put('/UpdateUser',usercontroller.UpdateUser);
router.delete('/delete',usercontroller.DeleteUser);
module.exports=router;