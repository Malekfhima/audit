import dotenv from "dotenv";
dotenv.config();

import mongoose, { Types } from "mongoose";
import path from "path";
import fs from "fs";
import config from "./config/config";
import logger from "./core/utils/logger";

/**
 * Converts 20-character hex IDs from the user's data
 * to 24-character MongoDB ObjectId strings.
 * 
 * Pattern: "65a60000000000000001" => "65a600000000000000000001"
 * Adds "0000" after position 16.
 */
function to24(id: string): string {
  if (id.length === 24) return id;
  if (id.length === 20) {
    return id.slice(0, 16) + "0000" + id.slice(16);
  }
  throw new Error(`Unexpected ID length: ${id.length} for "${id}"`);
}

function oid(id: string): Types.ObjectId {
  return new Types.ObjectId(to24(id));
}

/**
 * Recursively converts date strings and ObjectId references in data.
 * - Strings matching ISO date format become Date objects
 * - Strings matching 20-char ID format are converted via oid()
 */
function convertDoc(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") {
    // Check if it's a 20-char hex ID
    if (/^[0-9a-f]{20}$/i.test(obj)) {
      return oid(obj);
    }
    // Check if it's an ISO date string
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(obj)) {
      return new Date(obj);
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertDoc);
  }
  if (typeof obj === "object") {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = convertDoc(value);
    }
    return result;
  }
  return obj;
}

/**
 * Reads a JSON file and returns parsed data with converted ObjectIds & Dates.
 */
function loadData(filename: string): any[] {
  const filePath = path.join(__dirname, "seed-data", filename);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return raw.map(convertDoc);
}

async function seed() {
  try {
    logger.info("🚀 Connecting to MongoDB...");
    await mongoose.connect(config.database.mongoUri);
    logger.info("✅ Connected to MongoDB");

    const db = mongoose.connection.db!;

    // Clear existing collections
    const collections = [
      "users", "roles", "sites", "processes", "norms",
      "audits", "nonconformities", "correctiveactions",
      "risks", "legalrequirements", "legalcompliances",
      "reports", "notifications", "refreshtokens"
    ];

    for (const col of collections) {
      await db.collection(col).deleteMany({});
      logger.info(`  Cleared collection: ${col}`);
    }

    // ==================== USERS ====================
    // Seed data removed — register through the app to create an account.
    // To re-enable: load users.json and call User.create() for each doc.
    logger.info(`  ⏭ Skipped inserting users (seed disabled — register via /auth/register)`);

    // ==================== ROLES ====================
    const roles = [
      { _id: new Types.ObjectId("65a200000000000000000001"), name: "ADMIN", description: "Full access to all modules, users and system configuration.", permissions: ["users:read", "users:write", "roles:manage", "audits:read", "audits:write", "audits:delete", "nc:read", "nc:write", "actions:read", "actions:write", "risks:read", "risks:write", "legal:read", "legal:write", "reports:generate", "settings:manage"], isSystemRole: true, createdAt: new Date("2025-01-01T00:00:00Z"), updatedAt: new Date("2025-01-01T00:00:00Z") },
      { _id: new Types.ObjectId("65a200000000000000000002"), name: "MANAGER", description: "Manages sites, processes and oversees audits and corrective actions for their scope.", permissions: ["audits:read", "audits:write", "nc:read", "nc:write", "actions:read", "actions:write", "risks:read", "risks:write", "legal:read", "reports:generate"], isSystemRole: true, createdAt: new Date("2025-01-01T00:00:00Z"), updatedAt: new Date("2025-01-01T00:00:00Z") },
      { _id: new Types.ObjectId("65a200000000000000000003"), name: "AUDITOR", description: "Plans and conducts audits, records findings and raises non-conformities.", permissions: ["audits:read", "audits:write", "nc:read", "nc:write", "risks:read", "reports:generate"], isSystemRole: true, createdAt: new Date("2025-01-01T00:00:00Z"), updatedAt: new Date("2025-01-01T00:00:00Z") },
      { _id: new Types.ObjectId("65a200000000000000000004"), name: "USER", description: "Standard collaborator: can view assigned items and update corrective actions they own.", permissions: ["audits:read", "nc:read", "actions:read", "actions:write"], isSystemRole: true, createdAt: new Date("2025-01-01T00:00:00Z"), updatedAt: new Date("2025-01-01T00:00:00Z") },
    ];
    await db.collection("roles").insertMany(roles);
    logger.info(`  ✓ Inserted ${roles.length} roles`);

    // ==================== SITES ====================
    const sites = loadData("sites.json");
    await db.collection("sites").insertMany(sites);
    logger.info(`  ✓ Inserted ${sites.length} sites`);

    // ==================== PROCESSES ====================
    const processes = loadData("processes.json");
    await db.collection("processes").insertMany(processes);
    logger.info(`  ✓ Inserted ${processes.length} processes`);

    // ==================== NORMS ====================
    const norms = loadData("norms.json");
    await db.collection("norms").insertMany(norms);
    logger.info(`  ✓ Inserted ${norms.length} norms`);

    // ==================== AUDITS ====================
    const audits = [
      ...loadData("audits.json"),
      ...loadData("audits2.json"),
      ...loadData("audits3.json"),
    ];
    await db.collection("audits").insertMany(audits);
    logger.info(`  ✓ Inserted ${audits.length} audits`);

    // ==================== NON-CONFORMITIES ====================
    const nonConformities = [
      ...loadData("nonconformities.json"),
      ...loadData("nonconformities2.json"),
      ...loadData("nonconformities3.json"),
    ];
    await db.collection("nonconformities").insertMany(nonConformities);
    logger.info(`  ✓ Inserted ${nonConformities.length} non-conformities`);

    // ==================== CORRECTIVE ACTIONS ====================
    const correctiveActions = [
      ...loadData("correctiveactions.json"),
      ...loadData("correctiveactions2.json"),
    ];
    await db.collection("correctiveactions").insertMany(correctiveActions);
    logger.info(`  ✓ Inserted ${correctiveActions.length} corrective actions`);

    // ==================== RISKS ====================
    const risks = [
      ...loadData("risks.json"),
      ...loadData("risks2.json"),
      ...loadData("risks3.json"),
    ];
    await db.collection("risks").insertMany(risks);
    logger.info(`  ✓ Inserted ${risks.length} risks`);

    // ==================== LEGAL REQUIREMENTS ====================
    const legalRequirements = loadData("legalrequirements.json");
    await db.collection("legalrequirements").insertMany(legalRequirements);
    logger.info(`  ✓ Inserted ${legalRequirements.length} legal requirements`);

    // ==================== LEGAL COMPLIANCES ====================
    const legalCompliances = [
      ...loadData("legalcompliances.json"),
      ...loadData("legalcompliances2.json"),
    ];
    await db.collection("legalcompliances").insertMany(legalCompliances);
    logger.info(`  ✓ Inserted ${legalCompliances.length} legal compliances`);

    // ==================== REPORTS ====================
    const reports = loadData("reports.json");
    await db.collection("reports").insertMany(reports);
    logger.info(`  ✓ Inserted ${reports.length} reports`);

    // ==================== NOTIFICATIONS ====================
    const notifications = loadData("notifications.json");
    await db.collection("notifications").insertMany(notifications);
    logger.info(`  ✓ Inserted ${notifications.length} notifications`);

    logger.info("✅ Seed completed successfully!");
    logger.info("📋 Users: no seed users inserted — register via POST /api/auth/register");
    logger.info("   ⚠️  Other seed data (audits, NCs, actions, risks, etc.) still reference old user IDs");
    logger.info("   Tip: Insert an admin manually via MongoDB if needed (role: ADMIN)");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error("❌ Seed failed", error);
    process.exit(1);
  }
}

seed();
