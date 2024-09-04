import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import { logger } from "../app.js";

interface UserJwtPayload extends JwtPayload {
  id: string;
  // Add any other properties you expect in your JWT payload
}

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    logger.warn("Socket connection attempt without token", {
      socketId: socket.id,
    });
    return next(new Error("Authentication token is missing"));
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    logger.error("JWT_SECRET is not set in environment variables");
    return next(new Error("Server configuration error"));
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as UserJwtPayload;

    if (!decoded || typeof decoded === "string") {
      throw new Error("Invalid token format");
    }

    if (!("id" in decoded)) {
      throw new Error("Invalid token structure: missing 'id' field");
    }

    socket.data.user = decoded;
    logger.info("Socket authenticated", {
      socketId: socket.id,
      userId: decoded.id,
    });
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.error("JWT verification failed", {
        error: error.message,
        socketId: socket.id,
      });
      return next(new Error("Invalid authentication token"));
    } else if (error instanceof jwt.TokenExpiredError) {
      logger.error("Token expired", {
        error: error.message,
        socketId: socket.id,
      });
      return next(new Error("Authentication token has expired"));
    } else {
      logger.error("Unexpected error during socket authentication", {
        error,
        socketId: socket.id,
      });
      return next(new Error("Authentication failed"));
    }
  }
};
