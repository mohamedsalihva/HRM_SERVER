const express = require("express");
const router = express.Router();

const usercontroller =require('../controller/usercontroller')

router.post('/Adduser',usercontroller.Adduser);
router.get('/getuser',usercontroller.ViewList);

module.exports=router;