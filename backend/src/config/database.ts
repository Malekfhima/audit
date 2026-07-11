// ==============================================
// DATABASE.TS - MONGODB CONNECTION HANDLER
// ==============================================

import mongoose from "mongoose";
import config from "../config/config";
import logger from "../core/utils/logger";

/**
 * Connect to MongoDB
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    const { mongoUri } = config.database;

    // Optional mongoose settings
    mongoose.set("strictQuery", false);

    if (config.server.nodeEnv === "development") {
      mongoose.set("debug", true);
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      autoIndex: true,
    });

    logger.info("✅ MongoDB connected successfully");

    // Connection events
    mongoose.connection.on("connected", () => {
      logger.info("📦 Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      logger.error("❌ Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️ Mongoose disconnected from DB");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info(
        "🔌 Mongoose connection closed due to app termination"
      );
      process.exit(0);
    });
  } catch (error) {
    logger.error("❌ Failed to connect to MongoDB", error);
    throw error;
  }
};

export default connectDatabase;
