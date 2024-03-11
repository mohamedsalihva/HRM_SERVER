const express = require("express");
const router = express.Router();

const usercontroller =require('../controller/usercontroller')

router.post('/Adduser',usercontroller.Adduser)

module.exports=router;