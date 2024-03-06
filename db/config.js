const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


async function connect(){
 try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("database connection established..,")
 } catch (error) {
    console.log("database connection errorr:",error)
 }
}

module.exports=connect;