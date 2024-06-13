import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { eventRoutes, userRoutes } from "./routes/index.js";
import { requestLogger, errorHandler } from "./middlewares/index.js";
import { renderDebugView } from "./views/debugView.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(requestLogger);

app.use(cors());

app.set("view engine", "ejs");

app.use("/api/events", eventRoutes);
app.use("/api/users", userRoutes);

app.get("/debug", renderDebugView);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
