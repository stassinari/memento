CREATE TYPE "public"."bean_origin" AS ENUM('single-origin', 'blend');--> statement-breakpoint
CREATE TYPE "public"."extraction_type" AS ENUM('percolation', 'immersion');--> statement-breakpoint
CREATE TYPE "public"."roast_style" AS ENUM('filter', 'espresso', 'omni-roast');--> statement-breakpoint
CREATE TABLE "beans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fb_id" text,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"roaster" text NOT NULL,
	"roast_date" date,
	"roast_style" "roast_style",
	"roast_level" integer,
	"roasting_notes" text[] DEFAULT '{}'::text[] NOT NULL,
	"freeze_date" date,
	"thaw_date" date,
	"is_finished" boolean DEFAULT false NOT NULL,
	"origin" "bean_origin" NOT NULL,
	"country" text,
	"region" text,
	"varietals" text[] DEFAULT '{}'::text[] NOT NULL,
	"altitude" integer,
	"process" text,
	"farmer" text,
	"harvest_date" date,
	"blend_parts" jsonb,
	CONSTRAINT "beans_blend_parts_check" CHECK ("beans"."origin" <> 'blend' or ("beans"."blend_parts" is not null and jsonb_typeof("beans"."blend_parts") = 'array')),
	CONSTRAINT "beans_blend_parts_single_origin_check" CHECK ("beans"."origin" <> 'single-origin' or "beans"."blend_parts" is null)
);
--> statement-breakpoint
CREATE TABLE "brews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fb_id" text,
	"user_id" uuid NOT NULL,
	"beans_id" uuid NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"method" text NOT NULL,
	"grinder" text,
	"grinder_burrs" text,
	"water_type" text,
	"filter_type" text,
	"water_weight" numeric NOT NULL,
	"beans_weight" numeric NOT NULL,
	"water_temperature" numeric,
	"grind_setting" text,
	"time_minutes" integer,
	"time_seconds" integer,
	"rating" numeric(3, 1),
	"notes" text,
	"tds" numeric,
	"final_brew_weight" numeric,
	"extraction_type" "extraction_type",
	"aroma" numeric,
	"acidity" numeric,
	"sweetness" numeric,
	"body" numeric,
	"finish" numeric
);
--> statement-breakpoint
CREATE TABLE "espresso" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fb_id" text,
	"user_id" uuid NOT NULL,
	"beans_id" uuid,
	"date" timestamp with time zone NOT NULL,
	"grind_setting" text,
	"machine" text,
	"grinder" text,
	"grinder_burrs" text,
	"portafilter" text,
	"basket" text,
	"actual_time" numeric NOT NULL,
	"target_weight" numeric,
	"beans_weight" numeric,
	"water_temperature" numeric,
	"actual_weight" numeric,
	"from_decent" boolean DEFAULT false NOT NULL,
	"partial" boolean,
	"profile_name" text,
	"uploaded_at" timestamp with time zone,
	"rating" numeric(3, 1),
	"notes" text,
	"tds" numeric,
	"aroma" numeric,
	"acidity" numeric,
	"sweetness" numeric,
	"body" numeric,
	"finish" numeric,
	CONSTRAINT "espresso_manual_required_fields_check" CHECK ("espresso"."from_decent" = true or ("espresso"."beans_id" is not null and "espresso"."target_weight" is not null and "espresso"."beans_weight" is not null)),
	CONSTRAINT "espresso_decent_required_fields_check" CHECK ("espresso"."from_decent" = false or ("espresso"."profile_name" is not null and "espresso"."uploaded_at" is not null and "espresso"."actual_weight" is not null))
);
--> statement-breakpoint
CREATE TABLE "espresso_decent_readings" (
	"espresso_id" uuid PRIMARY KEY NOT NULL,
	"time" jsonb NOT NULL,
	"pressure" jsonb NOT NULL,
	"weight_total" jsonb NOT NULL,
	"flow" jsonb NOT NULL,
	"weight_flow" jsonb NOT NULL,
	"temperature_basket" jsonb NOT NULL,
	"temperature_mix" jsonb NOT NULL,
	"pressure_goal" jsonb NOT NULL,
	"temperature_goal" jsonb NOT NULL,
	"flow_goal" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feature_flags" (
	"name" text PRIMARY KEY NOT NULL,
	"enabled" boolean DEFAULT false NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "tastings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fb_id" text,
	"user_id" uuid NOT NULL,
	"beans_id" uuid,
	"created_at" timestamp with time zone,
	"data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"fb_id" text,
	"secret_key" text
);
--> statement-breakpoint
ALTER TABLE "beans" ADD CONSTRAINT "beans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brews" ADD CONSTRAINT "brews_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "brews" ADD CONSTRAINT "brews_beans_id_beans_id_fk" FOREIGN KEY ("beans_id") REFERENCES "public"."beans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "espresso" ADD CONSTRAINT "espresso_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "espresso" ADD CONSTRAINT "espresso_beans_id_beans_id_fk" FOREIGN KEY ("beans_id") REFERENCES "public"."beans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "espresso_decent_readings" ADD CONSTRAINT "espresso_decent_readings_espresso_id_espresso_id_fk" FOREIGN KEY ("espresso_id") REFERENCES "public"."espresso"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tastings" ADD CONSTRAINT "tastings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tastings" ADD CONSTRAINT "tastings_beans_id_beans_id_fk" FOREIGN KEY ("beans_id") REFERENCES "public"."beans"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "beans_fb_id_unique" ON "beans" USING btree ("fb_id");--> statement-breakpoint
CREATE INDEX "beans_user_roast_date_idx" ON "beans" USING btree ("user_id","roast_date");--> statement-breakpoint
CREATE UNIQUE INDEX "brews_fb_id_unique" ON "brews" USING btree ("fb_id");--> statement-breakpoint
CREATE INDEX "brews_user_date_idx" ON "brews" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "brews_beans_idx" ON "brews" USING btree ("beans_id");--> statement-breakpoint
CREATE UNIQUE INDEX "espresso_fb_id_unique" ON "espresso" USING btree ("fb_id");--> statement-breakpoint
CREATE INDEX "espresso_user_date_idx" ON "espresso" USING btree ("user_id","date");--> statement-breakpoint
CREATE INDEX "espresso_beans_idx" ON "espresso" USING btree ("beans_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tastings_fb_id_unique" ON "tastings" USING btree ("fb_id");--> statement-breakpoint
CREATE INDEX "tastings_user_created_at_idx" ON "tastings" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "users_fb_id_unique" ON "users" USING btree ("fb_id");