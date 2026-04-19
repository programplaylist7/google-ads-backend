import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { generateAds } from "../controllers/Ads/generateAds.js";
import { getHistory } from "../controllers/Ads/getHistory.js";

const router = express.Router();

// 🔐 protected route
router.post("/generate/:modelName", protect, generateAds);
router.get("/history", protect, getHistory);

export default router;