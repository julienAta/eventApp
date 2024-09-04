import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import winston from "winston";
import expressWinston from "express-winston";

import router from "./routes/index.js";
import { errorHandler } from "./middlewares/index.js";
import { renderDebugView } from "./views/debugView.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

app.use(express.json());

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
  })
);

app.use(
  cors({
    origin: ["http://localhost:3001", "https://jjx-event-app.vercel.app"],
  })
);

app.use("/api", router);

app.set("view engine", "ejs");
app.get("/debug", renderDebugView);

const modifiedErrorHandler = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  logger.error("Error occurred:", { error: err.message, stack: err.stack });
  errorHandler(err, req, res, next);
};

app.use(modifiedErrorHandler);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

export { logger };
