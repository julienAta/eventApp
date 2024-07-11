import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtUtils";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const user = verifyToken(token);
      (req as any).user = user;
      next();
    } catch (error) {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(401);
  }
};
