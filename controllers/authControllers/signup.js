
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { User } from "../../models/User.js";



// ---------------- REGISTER ----------------
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // hash password before saving
    const salt = await bcrypt.genSalt(10); // generate salt
    const hashedPassword = await bcrypt.hash(password, salt); // hash password

    // create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // store hashed password
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (error) {
    res.status(500).json({success: false, message: "Server error" });
  }
};


