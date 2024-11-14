import express from "express";
import cors from "cors";

export function setupMiddleware(app: express.Application) {
  app.use(cors());
  app.use(express.json());
}
