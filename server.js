import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import adsRoutes from "./routes/adsRoutes.js";
import { adsRateLimiter } from "./middlewares/rateLimiter.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = process.env.FRONTEND_URLS.split(",");
const corsOptions = {
  origin: function (origin, callback) {
    // allow server-to-server / postman / curl
    if (!origin) return callback(null, true);

    // strict match check
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
};

app.use(cors(corsOptions));
app.use(adsRateLimiter);
connectDB();

app.get("/data", (req, res) => {
  res.json({ msg: "This is CORS-enabled" });
});

app.use("/api/auth", authRoutes);
app.use("/api/ads", adsRoutes);

import serverlessExpress from "@vendia/serverless-express";
export const handler = serverlessExpress({ app });
