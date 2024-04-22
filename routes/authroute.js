const express = require('express');
const  router = express.Router()
const accessControl = require('../utils/access-control').accessControl
const authercontroller=require('../controller/authcontroller')

const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next);
    }
};



router.post('/login',setAccessControl('*'),authercontroller.login)
router.post('/forgot-password',setAccessControl('*'),authercontroller.forgotpassword)

module.exports=router;