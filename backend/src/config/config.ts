// ==============================================
// CONFIG.TS - APPLICATION CONFIGURATION
// ==============================================

import dotenv from "dotenv";

dotenv.config();

/**
 * Interfaces for type safety
 */
interface ServerConfig {
  port: number;
  nodeEnv: string;
}

interface DatabaseConfig {
  mongoUri: string;
}

interface JwtConfig {
  jwtSecret: string;
  refreshTokenSecret: string;
  jwtExpiresIn: string;
  refreshTokenExpiresIn: string;
}

interface CorsConfig {
  corsOrigin: string;
}

interface LoggingConfig {
  logLevel: string;
}

interface PaginationConfig {
  defaultPageSize: number;
  maxPageSize: number;
}

interface SecurityConfig {
  rateLimitMax: number;
  rateLimitWindow: number;
  bcryptSaltRounds: number;
}

interface FrontendConfig {
  url: string;
}

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  authUser: string;
  authPass: string;
  fromAddress: string;
}

interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
  cors: CorsConfig;
  logging: LoggingConfig;
  pagination: PaginationConfig;
  security: SecurityConfig;
  frontend: FrontendConfig;
  email: EmailConfig;
}

/**
 * Configuration object
 */
const config: AppConfig = {
  server: {
    port: parseInt(process.env.PORT || "4000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
  },

  database: {
    mongoUri: process.env.MONGO_URI || "",
  },

  jwt: {
    jwtSecret: process.env.JWT_SECRET || "",
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || "",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1h",
    refreshTokenExpiresIn:
      process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  },

  cors: {
    corsOrigin: process.env.CORS_ORIGIN || "*",
  },

  logging: {
    logLevel: process.env.LOG_LEVEL || "info",
  },

  pagination: {
    defaultPageSize: parseInt(
      process.env.DEFAULT_PAGE_SIZE || "10",
      10
    ),
    maxPageSize: parseInt(
      process.env.MAX_PAGE_SIZE || "100",
      10
    ),
  },

  security: {
    rateLimitMax: parseInt(
      process.env.RATE_LIMIT_MAX || "100",
      10
    ),
    rateLimitWindow: parseInt(
      process.env.RATE_LIMIT_WINDOW || "15",
      10
    ),
    bcryptSaltRounds: parseInt(
      process.env.BCRYPT_SALT_ROUNDS || "10",
      10
    ),
  },

  frontend: {
    url: process.env.FRONTEND_URL || "http://localhost:5173",
  },

  email: {
    host: process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io",
    port: parseInt(process.env.EMAIL_PORT || "2525", 10),
    secure: process.env.EMAIL_SECURE === "true",
    authUser: process.env.EMAIL_AUTH_USER || "",
    authPass: process.env.EMAIL_AUTH_PASS || "",
    fromAddress: process.env.EMAIL_FROM || "noreply@auditpro.com",
  },
};

/**
 * Validation of required environment variables
 */
if (!config.database.mongoUri) {
  throw new Error("❌ MONGO_URI is missing in environment variables");
}

if (!config.jwt.jwtSecret) {
  throw new Error("❌ JWT_SECRET is missing in environment variables");
}

if (!config.jwt.refreshTokenSecret) {
  console.warn(
    "⚠️ REFRESH_TOKEN_SECRET not set, using empty string (not recommended)"
  );
}

export default config;
export { config };
