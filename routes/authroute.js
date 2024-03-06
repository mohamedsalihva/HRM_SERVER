const express = require('express');
const  router = express.Router()

const authercontroller=require('../controller/authcontroller')

router.post('/login',authercontroller.login)

module.exports=router;