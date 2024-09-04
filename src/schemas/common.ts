/** @notice library imports */
import { integer, timestamp, varchar, text, json } from "drizzle-orm/pg-core";
/// External events
import { SecuraEvents } from "@/listeners/constants";

/// Timestamps
export const commonTimestamps = {
  /// Timestamps
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
};

/// Blockchain fields
export const commonBlockchainFields = {
  blockNumber: integer("blockNumber").notNull(),
  blockHash: varchar("blockHash", { length: 66 }).notNull(),
  transactionHash: varchar("transactionHash", { length: 66 }).notNull(),
};

/// Blockchain fields including event params
export const commonBlockchainFieldsForEvents = {
  ...commonBlockchainFields,
  data: text("data").notNull(),
  event: text("event", {
    enum: [
      SecuraEvents.SecureLockCreated,
      SecuraEvents.SecureLockExtended,
      SecuraEvents.SecureLockUnlocked,
    ],
  }).notNull(),
  topics: json("topics").$type<readonly string[]>().notNull(),
};

/// Types
export type OmittedParams = "id" | "createdAt" | "updatedAt";
