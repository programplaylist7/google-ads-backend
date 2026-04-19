import { Generation } from "../../models/Generation.js";

export const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const history = await Generation.find({ user: userId }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      history,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch history",
    });
  }
};
