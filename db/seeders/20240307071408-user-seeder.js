'use strict';

module.exports = {
  up: (models, mongoose) => {
   return models.users
   .insertMany([
    {
      "id":"65e96b78ca2b993f06428c6d",
      "name":"james",
      "email":"james@gmail.com",
      "password":"james123456",
      "Adress":"ernakulam aluva"
    }
   ])
  },

  down: (models, mongoose) => {
   return models.users
   .deleteMany({
   _id:{
    $in:[
      "65e96b78ca2b993f06428c6d"
    ],
   },
   })
   .then((res)=>{
      console.log(res.deletedCount);
   });
  },
};
