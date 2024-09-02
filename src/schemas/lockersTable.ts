/** @notice library imports */
import {
  bigint,
  integer,
  pgTable,
  serial,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
/// External imports
import {
  commonTimestamps,
  commonBlockchainFieldsForEvents,
} from "@/schemas/common";
import { erc20s } from "@/schemas/erc20s";

/// Lockers
export const lockers = pgTable(
  "lockers",
  {
    /// Core fields
    id: serial("id").notNull().primaryKey(),
    lockId: bigint("lockId", { mode: "bigint" }).notNull(),
    name: text("name").notNull(),
    erc20: varchar("owner", { length: 42 })
      .notNull()
      .references(() => erc20s.address),
    owner: varchar("owner", { length: 42 }).notNull(),
    amount: bigint("amount", { mode: "bigint" }).notNull(),
    lockedOn: integer("lockedOn").notNull(),
    unlockOn: integer("unlockOn").notNull(),

    /// Blockchain fields
    ...commonBlockchainFieldsForEvents,

    /// Timestamps
    ...commonTimestamps,
  },
  (table) => {
    /// Indexers
    return {
      /// Non unique index
      lockeOwnerIdx: uniqueIndex("lockeOwnerIdx").on(table.owner),
      /// Unique index
      lockerIdIdx: uniqueIndex("lockerIdIdx").on(table.lockId),
    };
  }
);
