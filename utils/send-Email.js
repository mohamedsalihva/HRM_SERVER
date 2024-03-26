"use strict"

const nodemailer = require('nodemailer');

exports.sendEmail = async function (emails , subject , content){
    return new Promise (async(resolve , reject)=>{
     try {
        if(typeof emails == "object") emails = emails.join(",");

        let transporter = nodemailer.createTransport({
            host:process.env.HOST_EMAIL,
            port:process.env.EMAIL_PORT,
            secure:process.env.EMAIL_PORT == 465 ? true : false,
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            }
        });

        let info = await transporter.sendMail({
            from: '"HRM" <support@HRM.ru>', 
            to: emails, 
            subject: loginemail, 
            html: content, 
          });

          resolve(true);
     } catch (error) {
        reject(false);
     }
    });
};