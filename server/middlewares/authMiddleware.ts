import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { logger } from "../utils/logger";

// Make sure JWT_SECRET is properly typed and validated
if (!process.env.JWT_SECRET) {
  logger.error("JWT_SECRET is not defined in environment variables");
  throw new Error("JWT_SECRET must be defined");
}

const JWT_SECRET = process.env.JWT_SECRET;

// Define the payload type
interface UserPayload {
  id: string;
  email: string;
  role?: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}
export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Add type assertion to tell TypeScript this is a UserPayload
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

    // Validate the decoded payload
    if (!decoded || !decoded.id || !decoded.email) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(403).json({ message: "Token expired" });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: "Invalid token" });
    }

    logger.error("Auth error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};
