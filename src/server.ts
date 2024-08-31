import dbLoader from "@/common/loaders/db";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { pino } from "pino";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { errorHandler } from "@/common/middleware/errorHandler";
import requestLogger from "@/common/middleware/requestLogger";
import { env } from "@/common/utils/envConfig";
import { buildingLimitRouter } from "./api/buildingLimitSplitter/buildingLimitSplitterRouter";

const logger = pino({ name: "server start" });
const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
// NOTE: disabled for testing concurrency, enable in production
// app.use(rateLimiter);

// Request logging
app.use(requestLogger);

// load database, queues, etc
dbLoader();

// Routes
app.use("/health-check", healthCheckRouter);
app.use("/api/v1/geo", buildingLimitRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler);

export { app, logger };
