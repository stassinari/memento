ALTER TABLE "beans" ADD COLUMN "fb_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX "beans_user_fb_id_unique" ON "beans" USING btree ("user_id","fb_id") WHERE "beans"."fb_id" is not null;