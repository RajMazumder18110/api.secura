/** @notice library imports */
/// External imports
import { NODE_ENV } from "@/constants";

/// Application constants
export const isProduction = NODE_ENV === "production";

/// Database constants
export const DB_MIGRATION_PATH = `migrations`;
export const DB_SCHEMA_PATH = `src/schemas/index.ts`;
