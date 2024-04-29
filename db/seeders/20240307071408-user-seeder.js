'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (models, mongoose) => {
    try {
      // Hash the passwords
      const hashedPassword = await bcrypt.hash("Salih@123", 10); // Adjust the salt rounds as needed

      // Insert the seeded data with hashed passwords
      return models.users.insertMany([
        {
          _id: "65eb1a13212a3c1eb96cb993",
          name: "salih",
          email: "salih@gmail.com",
          password: hashedPassword,
          address: "ernakulam aluva",
          user_type: "65f93a3fa44207acf7b2777d",
        }
      ]);
    } catch (error) {
      console.error('Error seeding data:', error);
      throw error;
    }
  },

  down: (models, mongoose) => {
    return models.users.deleteMany({
      _id: {
        $in: ["65eb1a13212a3c1eb96cb993"],
      },
    }).then((res) => {
      console.log(res.deletedCount);
    });
  },
};
