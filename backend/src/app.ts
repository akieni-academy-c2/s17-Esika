import express, { type Express } from "express";
import logger from "./middleware/logger.middleware.ts";
import notFound from "./middleware/not-found.middlware.ts";
import errorHandler from "./middleware/error-handler.middleware.ts";

const app: Express = express();

app.use(express.json());

app.use(logger);

app.use(notFound);

app.use(errorHandler);

export default app;
