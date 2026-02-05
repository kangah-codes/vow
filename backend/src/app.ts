import express from "express";
import cors from "cors";
import passport from "./config/passport";
import routes from "./routes";
import { requestLogger } from "./middleware/logger.middleware";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);

app.use("/api", routes);

app.use(errorHandler);

export default app;
