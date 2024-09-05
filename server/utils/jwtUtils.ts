import jwt from "jsonwebtoken";
import { User } from "../types/userTypes";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your_refresh_token_secret";

export const generateAccessToken = (user: User): string => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    JWT_SECRET,
    {
      expiresIn: "15m", // Short-lived access token
    }
  );
};

export const generateRefreshToken = (user: User): string => {
  return jwt.sign(
    {
      id: user.id,
    },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d", // Long-lived refresh token
    }
  );
};

export const verifyAccessToken = (token: string): jwt.JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token: string): jwt.JwtPayload | string => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};
