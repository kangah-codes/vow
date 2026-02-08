import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import passport from "./config/passport";
import routes from "./routes";
import { requestLogger } from "./middleware/logger.middleware";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(requestLogger);

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per window
	standardHeaders: true,
	legacyHeaders: false,
	message: {
		success: false,
		error: "Too many requests, please try again later.",
	},
});

app.use("/api", apiLimiter, routes);
app.use(errorHandler);

export default app;
