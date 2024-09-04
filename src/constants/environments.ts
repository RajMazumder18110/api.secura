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
export const BLOCKCHAIN_WSS_URL = getEnv("BLOCKCHAIN_WSS_URL");
export const POSTGRES_DATABASE_URL = getEnv("POSTGRES_DATABASE_URL");
export const SECURA_CONTRACT_ADDRESS = getEnv("SECURA_CONTRACT_ADDRESS");
