import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import routes from "./routes";
import config from "./config/config";
import { errorHandler, notFoundHandler } from "./core/http/errorHandler";

const app = express();

/* =====================
   Security Middleware
===================== */
app.use(helmet());

app.use(
  cors({
    origin: config.cors.corsOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

/* =====================
   Rate Limiting
===================== */
const limiter = rateLimit({
  windowMs: config.security.rateLimitWindow * 60 * 1000,
  max: config.security.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

/* =====================
   Body Parsers
===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================
   Logging
===================== */
app.use(
  morgan(config.server.nodeEnv === "production" ? "combined" : "dev")
);

/* =====================
   Health Check
===================== */
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

/* =====================
   Routes
===================== */
app.use("/api", routes);

/* =====================
   404 Handler
===================== */
app.use(notFoundHandler);

/* =====================
   Global Error Handler
===================== */
app.use(errorHandler);




export default app;
