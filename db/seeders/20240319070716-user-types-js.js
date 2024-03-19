'use strict';

module.exports = {
  up: (models, mongoose) => {
    

    return models.user_types
    .insertMany([
      {
         _id:"65f93a3fa44207acf7b2777d",
         user_type: "admin",
      },
      {
        _id:"65f93a85a44207acf7b2777e",
        user_type: "employee",
      }
    ])
    .then((res)=>{
      console.log(res.insertedCount)
    })
  },

  down: (models, mongoose) => {
      
    return models.user_types
    .deleteMany({
     _id:{
       $in:[
        "65f93a3fa44207acf7b2777d",
        "65f93a85a44207acf7b2777e"
       ]
     } 
    })
    .then((res)=>{
      console.log(res.deletedCount);
    });

  },
};
