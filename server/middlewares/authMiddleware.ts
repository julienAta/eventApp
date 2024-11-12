import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { logger } from "../utils/logger";

// Make sure JWT_SECRET is properly typed and validated
if (!process.env.JWT_SECRET) {
  logger.error("JWT_SECRET is not defined in environment variables");
  throw new Error("JWT_SECRET must be defined");
}

const JWT_SECRET = process.env.JWT_SECRET;

// Define proper types for the user payload
interface UserPayload extends JwtPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}

export const authenticateJWT = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // Log the auth header for debugging (remove in production)
    logger.debug("Auth header:", authHeader);

    if (!authHeader) {
      logger.warn("No authorization header provided");
      return res.status(401).json({ message: "No token provided" });
    }

    // Check for Bearer scheme
    if (!authHeader.startsWith("Bearer ")) {
      logger.warn("Invalid authorization scheme");
      return res.status(401).json({ message: "Invalid authorization scheme" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      logger.warn("Token is empty");
      return res.status(401).json({ message: "No token provided" });
    }

    try {
      // Use promisified version of verify for better error handling
      const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;

      // Validate decoded token has required fields
      if (!decoded.id || !decoded.email) {
        logger.warn("Token payload missing required fields");
        return res.status(403).json({ message: "Invalid token payload" });
      }

      req.user = decoded;
      next();
    } catch (jwtError) {
      // Handle specific JWT errors
      if (jwtError instanceof jwt.TokenExpiredError) {
        logger.warn("Token expired");
        return res.status(403).json({ message: "Token expired" });
      }
      if (jwtError instanceof jwt.JsonWebTokenError) {
        logger.warn("Invalid token");
        return res.status(403).json({ message: "Invalid token" });
      }

      logger.error("JWT verification error:", jwtError);
      return res.status(403).json({ message: "Token verification failed" });
    }
  } catch (error) {
    logger.error("Authentication middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
