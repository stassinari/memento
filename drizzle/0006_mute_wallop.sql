DROP INDEX "beans_user_fb_id_unique";--> statement-breakpoint
ALTER TABLE "beans" DROP COLUMN "fb_id";--> statement-breakpoint
ALTER TABLE "tastings" DROP COLUMN "data";--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "name" text;
