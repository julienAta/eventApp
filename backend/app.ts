import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes/index";
import { requestLogger, errorHandler } from "./middlewares";
import { renderDebugView } from "./views/debugView";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

app.use("/api", router);

app.set("view engine", "ejs");
app.get("/debug", renderDebugView);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
