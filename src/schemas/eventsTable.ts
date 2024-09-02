/** @notice library imports */
import { index, pgTable, serial, uniqueIndex } from "drizzle-orm/pg-core";
/// External imports
import {
  OmittedParams,
  commonTimestamps,
  commonBlockchainFieldsForEvents,
} from "@/schemas/common";

/// Events
export const events = pgTable(
  "events",
  {
    /// Core fields
    id: serial("id").notNull().primaryKey(),
    /// Blockchain fields
    ...commonBlockchainFieldsForEvents,
    /// Timestamps
    ...commonTimestamps,
  },
  (table) => {
    /// Indexers
    return {
      /// Non unique index
      eventBlockNoIdx: index("eventBlockNoIdx").on(table.blockNumber),
      /// Unique index
      eventTxnHashIdx: uniqueIndex("eventTxnHashIdx").on(table.transactionHash),
    };
  }
);

/// Types
export type EventRecord = typeof events.$inferSelect;
export type NewEventRecordParams = Omit<EventRecord, OmittedParams>;
