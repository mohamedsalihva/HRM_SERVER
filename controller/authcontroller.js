const users = require('../db/models/users');
const success_function = require('../utils/response_handlers').success_function;
const error_function = require('../utils/response_handlers').error_function;
const jwt = require('jsonwebtoken');

exports.login = async function (req, res) {
  try {
    const { email, password } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Invalid email format");
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).send("Password must be at least 8 characters long");
    }

    // Find user in the database by email
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Compare password
    // Note: Implement your password comparison logic here (e.g., using bcrypt)
    // For example: const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = true; // Replace this with your actual password comparison logic

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({}, process.env.JWT_SECRET);

    // Send token back to the client
    return res.status(200).json({ token });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
