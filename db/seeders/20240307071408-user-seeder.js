'use strict';

module.exports = {
  up: (models, mongoose) => {
   return models.users
   .insertMany([
    {
      _id:"65eb1a13212a3c1eb96cb993",
      name:"salih",
      email:"salih@gmail.com",
      password:"salih123",
      address:"ernakulam aluva",
      user_type:"65f93a3fa44207acf7b2777d",
    }
   ])
  },

  down: (models, mongoose) => {
   return models.users
   .deleteMany({
   _id:{
    $in:[
      "65eb1a13212a3c1eb96cb993"
    ],
   },
   })
   .then((res)=>{
      console.log(res.deletedCount);
   });
  },
};
