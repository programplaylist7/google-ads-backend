import express from "express"
import { register } from "../controllers/authControllers/signup.js";
import { login } from "../controllers/authControllers/login.js";
import { getUserDetail } from "../controllers/authControllers/getUserDetail.js";
import { protect } from "../middlewares/authMiddleware.js";
import { logout } from "../controllers/authControllers/logout.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/userDetail", protect, getUserDetail);

export default router