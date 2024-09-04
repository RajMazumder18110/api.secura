/** @notice library imports */
import { index, integer, pgTable, serial, text } from "drizzle-orm/pg-core";
/// External imports
import { SecuraEvents } from "@/listeners/constants";
import { OmittedParams, commonTimestamps } from "@/schemas/common";

/// Sync details
export const sync = pgTable(
  "sync",
  {
    /// Core fields
    id: serial("id").notNull().primaryKey(),
    syncedBlockNumber: integer("syncedBlockNumber").notNull(),
    event: text("event", {
      enum: [
        SecuraEvents.SecureLockCreated,
        SecuraEvents.SecureLockExtended,
        SecuraEvents.SecureLockUnlocked,
      ],
    }).notNull(),
    /// Timestamps
    ...commonTimestamps,
  },
  (table) => {
    /// Indexers
    return {
      /// Non unique index
      syncedBlockNumberIdx: index("syncedBlockNumberIdx").on(
        table.syncedBlockNumber
      ),
    };
  }
);

/// Types
export type SyncRecord = typeof sync.$inferSelect;
export type NewSyncRecordParams = Omit<SyncRecord, OmittedParams>;
