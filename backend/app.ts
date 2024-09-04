import express from "express";
import http from "http";
import dotenv from "dotenv";
import { initializeSocketIO } from "./socketHandlers/socketManager";
import { setupMiddleware } from "./middlewares/middleware.js";
import { logger } from "./utils/logger";
import router from "./routes/index.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

initializeSocketIO(server);

setupMiddleware(app);

app.use("/api", router);

const port = process.env.PORT || 3000;

server.listen(port, () => {
  logger.log({ level: "info", message: `Server is running on port ${port}` });
});
