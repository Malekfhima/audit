import winston from "winston";
import path from "path";
import fs from "fs";
import config from "../../config/config";

const logDir = path.join(process.cwd(), "logs");

// Create logs directory if not exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFormat = winston.format.printf(
  ({ level, message, timestamp, stack }) => {
    return `[${timestamp}] [${level.toUpperCase()}]: ${
      stack || message
    }`;
  }
);

const logger = winston.createLogger({
  level: config.logging.logLevel,
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format:
        config.server.nodeEnv === "development"
          ? winston.format.combine(
              winston.format.colorize(),
              winston.format.timestamp(),
              logFormat
            )
          : winston.format.combine(
              winston.format.timestamp(),
              logFormat
            ),
    }),

    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),

    new winston.transports.File({
      filename: path.join(logDir, "combined.log"),
      level: "info",
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

export default logger;
