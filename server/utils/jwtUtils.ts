import jwt from "jsonwebtoken";
import { User, TokenPayload } from "../types/userTypes";
import { logger } from "../utils/logger";

// Environment variables validation
if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error(
    "JWT_SECRET and REFRESH_TOKEN_SECRET must be defined in environment variables"
  );
}

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

export class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

export const generateAccessToken = (user: User): string => {
  try {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      JWT_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      }
    );
  } catch (error) {
    logger.error("Error generating access token:", error);
    throw new TokenError("Failed to generate access token");
  }
};

export const generateRefreshToken = (user: User): string => {
  try {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      }
    );
  } catch (error) {
    logger.error("Error generating refresh token:", error);
    throw new TokenError("Failed to generate refresh token");
  }
};

export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new TokenError("Access token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new TokenError("Invalid access token");
    }
    logger.error("Error verifying access token:", error);
    throw new TokenError("Failed to verify access token");
  }
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new TokenError("Refresh token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new TokenError("Invalid refresh token");
    }
    logger.error("Error verifying refresh token:", error);
    throw new TokenError("Failed to verify refresh token");
  }
};
