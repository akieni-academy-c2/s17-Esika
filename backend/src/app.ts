/// <reference path="./types/express.d.ts" />
import express, { type Express } from "express";
import cors from "cors";
import logger from "./middleware/logger.middleware.ts";
import notFound from "./middleware/not-found.middleware.ts"
import errorHandler from "./middleware/error-handler.middleware.ts";
import { announcerRoutes } from "./modules/announcer/index.ts";
import { tenantRoutes } from "./modules/tenant/index.ts";
import { publicRoutes } from "./modules/public/index.ts";
import { adminRoutes } from "./modules/admin/index.ts";
import adminCompatRoutes from "./modules/admin/routes/compat.route.ts";

const app: Express = express();

app.use(cors());

app.use(express.json());

app.use(logger);

// Routes
app.use("/api/announcer", announcerRoutes);
app.use("/api/tenant", tenantRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminCompatRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;
