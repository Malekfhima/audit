import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import connectDatabase from "./config/database";
import logger from "./core/utils/logger";
import config from "./config/config";

let server: any;

const startServer = async () => {
  try {
    logger.info("🚀 Starting server...");

    await connectDatabase();

    server = app.listen(config.server.port, () => {
      logger.info(
        `✅ Server listening on port ${config.server.port}`
      );
    });
  } catch (error) {
    logger.error("❌ Server startup failed", error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("❌ Uncaught Exception", {
    message: err.message,
    stack: err.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason: any) => {
  logger.error("❌ Unhandled Rejection", {
    reason,
  });

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

startServer();
