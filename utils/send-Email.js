"use strict"

const dotenv = require('dotenv');

dotenv.config()

const nodemailer = require('nodemailer');

exports.sendEmail = async function (emails, subject, content) {

    return new Promise(async (resolve, reject) => {
        try {
            if (typeof emails == "object") emails = emails.join(",");
            console.log("Reached here")
            console.log("Email_Host:", process.env.Email_Host)
            console.log("Email_Port:",process.env.Email_Port)
            console.log("Email_User:", process.env.Email_User)
            console.log("Email_Password:",process.env.Email_Password)

            let transporter =await nodemailer.createTransport({
                host: process.env.Email_Host,
                port: process.env.Email_Port,
                secure: false,
                auth: {
                    user: process.env.Email_User,
                    pass: process.env.Email_Password,
                }
            });

            console.log("emails:",emails)
            console.log("subject:",subject)
            // console.log("content:",content)
            // console.log("before info log")
            
            let info = await transporter.sendMail({
                from: '"HRM" <support@HRM.ru>',
                to: emails,
                subject,
                html: content,
            });
            // console.log("after info log")

            // console.log("reached here")
            resolve(true);
        } catch (error) {
            console.log("error:",error)
            reject(false);
        }
    });
};