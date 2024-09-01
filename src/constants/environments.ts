/** @notice library imports */
import "dotenv/config";

/// Env grabbing
const getEnv = (envName: SecuraEnv, defaultValue?: string): string => {
  /// Checking for env
  const env = process.env[envName] || defaultValue;
  if (!env) throw new Error(`"${envName}" is missing`);
  return env;
};

/// Envs
export const PORT = getEnv("PORT", "3000");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const POSTGRES_DATABASE_URL = getEnv("POSTGRES_DATABASE_URL");
