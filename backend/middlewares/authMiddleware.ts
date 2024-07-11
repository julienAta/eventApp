import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils.js";
import { z } from "zod";

const TokenPayloadSchema = z.object({
  id: z.string(),
  email: z.string().email(),
});

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = verifyToken(token);
      const user = TokenPayloadSchema.parse(decoded);
      (req as any).user = user;
      next();
    } catch (error) {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};
