import jwt from "jsonwebtoken";
import { User } from "../../models/User.js";
import { generateAccessToken } from "../../utis/generateTokens.js"; 
import ms from "ms"

export const refreshTokenHandler = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    // ❌ Case 1: No refresh token
    if (!token) {
      return res.status(401).json({
        success: false,
        code: "NO_REFRESH_TOKEN",
        message: "Refresh token missing",
      });
    }

    let decoded;

    try {
      // verify refresh token
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        code: "INVALID_REFRESH_TOKEN",
        message: "Invalid Credential",
      });
    }

    // check user exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    // ❌ Case 4: Token mismatch (single session logic)
    if (user.refreshToken !== token) {
      return res.status(403).json({
        success: false,
        code: "TOKEN_MISMATCH",
        message: "Session expired. Please login again.",
      });
    }

    // ✅ Case 5: Valid → generate ONLY access token
    const {accessToken} = generateAccessToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms(process.env.generateTokenExpiry),
    });

    return res.json({
      code: "SUCCESS",
      message: "Access token refreshed",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      code: "SERVER_ERROR",
      message: "Something went wrong",
    });
  }
};