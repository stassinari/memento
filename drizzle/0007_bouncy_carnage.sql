ALTER TABLE "beans" ADD COLUMN "archive_date" date;--> statement-breakpoint
ALTER TABLE "beans" ADD CONSTRAINT "beans_archive_date_check" CHECK ("beans"."archive_date" is null or "beans"."is_archived");--> statement-breakpoint
ALTER TABLE "beans" ADD CONSTRAINT "beans_thaw_implies_freeze_check" CHECK ("beans"."thaw_date" is null or "beans"."freeze_date" is not null);