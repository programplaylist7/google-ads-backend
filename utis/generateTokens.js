import jwt from "jsonwebtoken";

// generate both tokens
export const generateTokens = (userId) => {

  // access token (short life)
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.generateTokenExpiry }
  );

  // refresh token (long life)
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.refreshTokenExpiry }
  );

  return { accessToken, refreshToken };
};