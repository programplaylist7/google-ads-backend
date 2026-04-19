import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateTokens } from "../../utis/generateTokens.js";
import { User } from "../../models/User.js";
import ms from "ms"


// ---------------- LOGIN ----------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Required data not found",
      });

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User Not Found" });
    }

    // compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid Password" });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true, 
      secure: true,
      maxAge: ms(process.env.generateTokenExpiry),
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: ms(process.env.refreshTokenExpiry),
    });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        quota: user.quota,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
