/** @notice library imports */
import {
  bigint,
  boolean,
  index,
  pgTable,
  serial,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
/// External imports
import {
  OmittedParams,
  commonTimestamps,
  commonBlockchainFieldsForEvents,
} from "@/schemas/common";
import { erc20s } from "@/schemas/erc20sTable";

/// Lockers
export const lockers = pgTable(
  "lockers",
  {
    /// Core fields
    id: serial("id").notNull().primaryKey(),
    lockId: text("lockId").notNull().unique(),
    name: text("name").notNull(),
    erc20: varchar("erc20", { length: 42 })
      .notNull()
      .references(() => erc20s.address),
    owner: varchar("owner", { length: 42 }).notNull(),
    amount: text("amount").notNull(),
    isUnlocked: boolean("isUnlocked").notNull().default(false),
    lockedOn: bigint("lockedOn", { mode: "bigint" }).notNull(),
    unlockOn: bigint("unlockOn", { mode: "bigint" }).notNull(),

    /// Blockchain fields
    ...commonBlockchainFieldsForEvents,

    /// Timestamps
    ...commonTimestamps,
  },
  (table) => {
    /// Indexers
    return {
      /// Non unique index
      lockeOwnerIdx: index("lockeOwnerIdx").on(table.owner),
      /// Unique index
      lockerIdIdx: uniqueIndex("lockerIdIdx").on(table.lockId),
    };
  }
);

/// Types
export type Locker = typeof lockers.$inferSelect;
export type NewLockerParams = Omit<Locker, OmittedParams | "isUnlocked">;
export type UpdateLockerUnlockParams = Pick<Locker, "lockId" | "unlockOn">;
export type UnlockLockerParams = UpdateLockerUnlockParams;
