ALTER TABLE "students" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "subjects" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "teachers" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "attendances" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "class_offerings" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "enrollments" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "students" CASCADE;--> statement-breakpoint
DROP TABLE "subjects" CASCADE;--> statement-breakpoint
DROP TABLE "teachers" CASCADE;--> statement-breakpoint
DROP TABLE "attendances" CASCADE;--> statement-breakpoint
DROP TABLE "class_offerings" CASCADE;--> statement-breakpoint
DROP TABLE "enrollments" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_teacher_id_teachers_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "teacher_id";--> statement-breakpoint
DROP TYPE "public"."attendance_status";--> statement-breakpoint
DROP TYPE "public"."class_offering_status";--> statement-breakpoint
DROP TYPE "public"."enrollment_status";