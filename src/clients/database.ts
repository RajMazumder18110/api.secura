/** @notice library imports */
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
/// External imports
import * as schema from "@/schemas";
import { POSTGRES_DATABASE_URL } from "@/constants";

/// Postgres DB client
const pgClient = postgres(POSTGRES_DATABASE_URL);
export const database = drizzle(pgClient, { schema });
