import { User } from "../../models/User.js";

// GET /api/auth/me
export const getUserDetail = async (req, res) => {
  try {
    
    // req.user comes from protect middleware
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};