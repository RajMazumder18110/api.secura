/** @notice library imports */
import {
  bigint,
  index,
  integer,
  pgTable,
  serial,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
/// External imports
import { commonTimestamps } from "@/schemas/common";

/// ERC20s
export const erc20s = pgTable(
  "erc20s",
  {
    /// Core fields
    id: serial("id").notNull().primaryKey(),
    name: text("name").notNull(),
    symbol: text("symbol").notNull(),
    decimals: integer("decimals").notNull().default(18),
    address: varchar("address", { length: 42 }).notNull(),
    totalSupply: bigint("totalSupply", { mode: "bigint" }).notNull(),

    /// Timestamps
    ...commonTimestamps,
  },
  (table) => {
    /// Indexers
    return {
      /// Non unique index
      erc20NameIdx: index("erc20NameIdx").on(table.name),
      erc20SymbolIdx: index("erc20SymbolIdx").on(table.symbol),
      /// Unique index
      erc20AddressIdex: uniqueIndex("erc20AddressIdex").on(table.address),
    };
  }
);
