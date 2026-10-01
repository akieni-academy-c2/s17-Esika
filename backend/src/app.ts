import express, { type Express } from "express";
import logger from "./middleware/logger.middleware.ts";
import notFound from "./middleware/not-found.middlware.ts";
import errorHandler from "./middleware/error-handler.middleware.ts";
import { announcerRoutes } from "./modules/announcer/index.ts";
import cors from "cors";

const app: Express = express();

app.use(cors());

app.use(express.json());

app.use(logger);

// Routes
app.use("/api/announcer", announcerRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;
