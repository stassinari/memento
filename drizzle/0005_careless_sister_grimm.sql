CREATE TYPE "public"."tasting_variable" AS ENUM('beans', 'method', 'waterType', 'filterType', 'grinder');--> statement-breakpoint
CREATE TABLE "tasting_samples" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tasting_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"variable_value_text" text,
	"variable_value_beans_id" uuid,
	"note" text,
	"actual_time_minutes" integer,
	"actual_time_seconds" integer,
	"overall" numeric(3, 1),
	"flavours" text[] DEFAULT '{}'::text[] NOT NULL,
	"aroma_quantity" numeric,
	"aroma_quality" numeric,
	"aroma_notes" text,
	"acidity_quantity" numeric,
	"acidity_quality" numeric,
	"acidity_notes" text,
	"sweetness_quantity" numeric,
	"sweetness_quality" numeric,
	"sweetness_notes" text,
	"body_quantity" numeric,
	"body_quality" numeric,
	"body_notes" text,
	"finish_quantity" numeric,
	"finish_quality" numeric,
	"finish_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tasting_samples_variable_value_xor_check" CHECK (("tasting_samples"."variable_value_text" is null) <> ("tasting_samples"."variable_value_beans_id" is null))
);
--> statement-breakpoint
ALTER TABLE "tastings" DROP CONSTRAINT "tastings_beans_id_beans_id_fk";
--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "date" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "variable" "tasting_variable";--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "note" text;--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "method" text;--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "water_weight" numeric;--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "beans_weight" numeric;--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "water_temperature" numeric;--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "grinder" text;--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "grind_setting" text;--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "water_type" text;--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "filter_type" text;--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "target_time_minutes" integer;--> statement-breakpoint
ALTER TABLE "tastings" ADD COLUMN "target_time_seconds" integer;--> statement-breakpoint
ALTER TABLE "tasting_samples" ADD CONSTRAINT "tasting_samples_tasting_id_tastings_id_fk" FOREIGN KEY ("tasting_id") REFERENCES "public"."tastings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasting_samples" ADD CONSTRAINT "tasting_samples_variable_value_beans_id_beans_id_fk" FOREIGN KEY ("variable_value_beans_id") REFERENCES "public"."beans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tasting_samples_tasting_idx" ON "tasting_samples" USING btree ("tasting_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tasting_samples_tasting_position_unique" ON "tasting_samples" USING btree ("tasting_id","position");--> statement-breakpoint
ALTER TABLE "tastings" ADD CONSTRAINT "tastings_beans_id_beans_id_fk" FOREIGN KEY ("beans_id") REFERENCES "public"."beans"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "tastings_user_date_idx" ON "tastings" USING btree ("user_id","date");