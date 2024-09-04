CREATE TABLE IF NOT EXISTS "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"blockNumber" integer NOT NULL,
	"blockHash" varchar(66) NOT NULL,
	"transactionHash" varchar(66) NOT NULL,
	"data" text NOT NULL,
	"event" text NOT NULL,
	"topics" json NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "erc20s" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"symbol" text NOT NULL,
	"decimals" integer DEFAULT 18 NOT NULL,
	"address" varchar(42) NOT NULL,
	"totalSupply" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "erc20s_address_unique" UNIQUE("address")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "lockers" (
	"id" serial PRIMARY KEY NOT NULL,
	"lockId" text NOT NULL,
	"name" text NOT NULL,
	"erc20" varchar(42) NOT NULL,
	"owner" varchar(42) NOT NULL,
	"amount" text NOT NULL,
	"isUnlocked" boolean DEFAULT false NOT NULL,
	"lockedOn" bigint NOT NULL,
	"unlockOn" bigint NOT NULL,
	"blockNumber" integer NOT NULL,
	"blockHash" varchar(66) NOT NULL,
	"transactionHash" varchar(66) NOT NULL,
	"data" text NOT NULL,
	"event" text NOT NULL,
	"topics" json NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "lockers_lockId_unique" UNIQUE("lockId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sync" (
	"id" serial PRIMARY KEY NOT NULL,
	"syncedBlockNumber" integer NOT NULL,
	"event" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "lockers" ADD CONSTRAINT "lockers_erc20_erc20s_address_fk" FOREIGN KEY ("erc20") REFERENCES "public"."erc20s"("address") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "eventBlockNoIdx" ON "events" USING btree ("blockNumber");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "eventTxnHashIdx" ON "events" USING btree ("transactionHash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "erc20NameIdx" ON "erc20s" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "erc20SymbolIdx" ON "erc20s" USING btree ("symbol");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "erc20AddressIdex" ON "erc20s" USING btree ("address");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "lockeOwnerIdx" ON "lockers" USING btree ("owner");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "lockerIdIdx" ON "lockers" USING btree ("lockId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "syncedBlockNumberIdx" ON "sync" USING btree ("syncedBlockNumber");