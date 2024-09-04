DROP INDEX IF EXISTS "lockeOwnerIdx";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "lockeOwnerIdx" ON "lockers" USING btree ("owner");