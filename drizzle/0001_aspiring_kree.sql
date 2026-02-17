ALTER TABLE "feature_flags" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "feature_flags" CASCADE;--> statement-breakpoint
DROP INDEX "beans_fb_id_unique";--> statement-breakpoint
DROP INDEX "brews_fb_id_unique";--> statement-breakpoint
DROP INDEX "espresso_fb_id_unique";--> statement-breakpoint
DROP INDEX "tastings_fb_id_unique";--> statement-breakpoint
ALTER TABLE "beans" DROP COLUMN "fb_id";--> statement-breakpoint
ALTER TABLE "brews" DROP COLUMN "fb_id";--> statement-breakpoint
ALTER TABLE "espresso" DROP COLUMN "fb_id";--> statement-breakpoint
ALTER TABLE "tastings" DROP COLUMN "fb_id";