import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {

    const token = req.cookies.accessToken;

    // ❌ Case 1: No token
    if (!token) {
      return res.status(401).json({
        success: false,
        code: "NO_TOKEN",
        message: "Access token missing"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;
    next();

  } catch (error) {

    // ❌ Case 2: Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Access token expired"
      });
    }

    // ❌ Case 3: Invalid token
    return res.status(401).json({
      success: false,
      code: "INVALID_TOKEN",
      message: "Invalid token"
    });
  }
};