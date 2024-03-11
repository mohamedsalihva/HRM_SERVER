const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authroute')
const userRoutes = require('./routes/userroute')
dotenv.config();



const connect= require('./db/config')


connect();


app.use(express.urlencoded({extended:false}));




app.use(express.json());



app.use(cors());

app.use(authRoutes);

app.use(userRoutes);

app.listen(process.env.port, () => {
    console.log(`server running at http://localhost:${process.env.port}`)
});