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

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Type narrowing
    if (typeof decoded === "string") {
      throw new Error("Unexpected token format");
    }

    // Check if the decoded token has the expected structure
    if (!("id" in decoded)) {
      throw new Error("Invalid token structure");
    }

    const userPayload = decoded as UserJwtPayload;

    socket.data.user = userPayload;
    logger.info("Socket authenticated", {
      socketId: socket.id,
      userId: userPayload.id,
    });
    next();
  } catch (error) {
    logger.error("Socket authentication failed", {
      error,
      socketId: socket.id,
    });
    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error("Authentication token has expired"));
    }
    if (error instanceof Error) {
      return next(error);
    }
    next(new Error("Invalid authentication token"));
  }
};
