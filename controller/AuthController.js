import bcrypt from "bcrypt";
import User from "../Models/UserModel.js";

export const registerUser = async (req, res) => {
  try {
    let { firstName, lastName, email, password } = req.body;

    // 1. Required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, last name, email and password are required"
      });
    }

    // 2. Type validation
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid input type"
      });
    }

    // 3. Trim input
    firstName = firstName.trim();
    lastName = lastName.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    // 4. Check empty values after trim
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Fields cannot be empty"
      });
    }

    // 5. Name validation
    const nameRegex = /^[A-Za-z\s'-]+$/;

    if (!nameRegex.test(firstName)) {
      return res.status(400).json({
        success: false,
        message: "First name contains invalid characters"
      });
    }

    if (!nameRegex.test(lastName)) {
      return res.status(400).json({
        success: false,
        message: "Last name contains invalid characters"
      });
    }

    // 6. Email validation
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // 7. Password validation
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    // Optional stronger password validation
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one uppercase letter"
      });
    }

    if (!/[a-z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one lowercase letter"
      });
    }

    if (!/[0-9]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one number"
      });
    }

    // 8. Check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // 9. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 10. Create user
    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    // 11. Success response
    return res.status(201).json({
      success: true,
      message: "User registered successfully"
    });

  } catch (error) {
    console.error("Register error:", error);

    // Mongoose validation error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(
        (err) => err.message
      );

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }

    // Unexpected server error
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};