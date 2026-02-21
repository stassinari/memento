-- Trigger for updated_at column
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;--> statement-breakpoint

-- Tastings already has created_at, just update the default and NOT NULL constraint
ALTER TABLE "tastings" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "tastings" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint

-- ============================================================
-- PHASE 1: Add columns as nullable with no default
-- ============================================================

ALTER TABLE "beans" ADD COLUMN "created_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "beans" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint

ALTER TABLE "brews" ADD COLUMN "created_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "brews" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint

ALTER TABLE "espresso" ADD COLUMN "created_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "espresso" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint

ALTER TABLE "espresso_decent_readings" ADD COLUMN "created_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "espresso_decent_readings" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint

ALTER TABLE "tastings" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint

ALTER TABLE "users" ADD COLUMN "created_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updated_at" timestamp with time zone;--> statement-breakpoint

-- ============================================================
-- PHASE 2: Backfill existing records with sentinel / now()
-- ============================================================

UPDATE "beans" SET "created_at" = '1970-01-01 00:00:00+00', "updated_at" = now() WHERE "created_at" IS NULL;--> statement-breakpoint
UPDATE "brews" SET "created_at" = '1970-01-01 00:00:00+00', "updated_at" = now() WHERE "created_at" IS NULL;--> statement-breakpoint
UPDATE "espresso" SET "created_at" = '1970-01-01 00:00:00+00', "updated_at" = now() WHERE "created_at" IS NULL;--> statement-breakpoint
UPDATE "espresso_decent_readings" SET "created_at" = '1970-01-01 00:00:00+00', "updated_at" = now() WHERE "created_at" IS NULL;--> statement-breakpoint
UPDATE "tastings" SET "updated_at" = now() WHERE "updated_at" IS NULL;--> statement-breakpoint
UPDATE "users" SET "created_at" = '1970-01-01 00:00:00+00', "updated_at" = now() WHERE "created_at" IS NULL;--> statement-breakpoint

-- ============================================================
-- PHASE 3: Apply default and NOT NULL constraints
-- ============================================================

ALTER TABLE "beans" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "beans" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "beans" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "beans" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint

ALTER TABLE "brews" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "brews" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "brews" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "brews" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint

ALTER TABLE "espresso" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "espresso" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "espresso" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "espresso" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint

ALTER TABLE "espresso_decent_readings" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "espresso_decent_readings" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "espresso_decent_readings" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "espresso_decent_readings" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint

ALTER TABLE "tastings" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "tastings" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint

ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;

-- Add triggers to update the updated_at column on updates
CREATE TRIGGER set_updated_at BEFORE UPDATE ON "beans" FOR EACH ROW EXECUTE FUNCTION set_updated_at();--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON "brews" FOR EACH ROW EXECUTE FUNCTION set_updated_at();--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON "espresso" FOR EACH ROW EXECUTE FUNCTION set_updated_at();--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON "espresso_decent_readings" FOR EACH ROW EXECUTE FUNCTION set_updated_at();--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON "tastings" FOR EACH ROW EXECUTE FUNCTION set_updated_at();--> statement-breakpoint
CREATE TRIGGER set_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION set_updated_at();