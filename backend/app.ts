import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes/index.js";
import { requestLogger, errorHandler } from "./middlewares/index.js";
import { renderDebugView } from "./views/debugView.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);

app.use(
  cors({
    origin: ["http://localhost:3001", "https://jjx-event-app.vercel.app"],
  })
);

app.use("/api", router);

app.set("view engine", "ejs");
app.get("/debug", renderDebugView);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
