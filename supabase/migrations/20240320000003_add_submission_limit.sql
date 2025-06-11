-- Add submission limit fields to instances table
ALTER TABLE "public"."instances"
ADD COLUMN IF NOT EXISTS "submission_limit_enabled" boolean DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS "max_submissions_per_session" integer DEFAULT 5 NOT NULL,
ADD COLUMN IF NOT EXISTS "current_submissions" integer DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS "last_submission_at" timestamp with time zone;

-- Update existing instances to have default values
UPDATE "public"."instances"
SET 
  submission_limit_enabled = false,
  max_submissions_per_session = 5,
  current_submissions = 0
WHERE submission_limit_enabled IS NULL;

-- Add comment to explain the fields
COMMENT ON COLUMN "public"."instances"."submission_limit_enabled" IS 'Whether to enable submission limits for this instance';
COMMENT ON COLUMN "public"."instances"."max_submissions_per_session" IS 'Maximum number of submissions allowed per session when submission_limit_enabled is true';
COMMENT ON COLUMN "public"."instances"."current_submissions" IS 'Current number of submissions in the session';
COMMENT ON COLUMN "public"."instances"."last_submission_at" IS 'Timestamp of the last submission';

-- Add check constraint to ensure max_submissions_per_session is positive
ALTER TABLE "public"."instances"
ADD CONSTRAINT "max_submissions_positive" CHECK (max_submissions_per_session > 0);

-- Add check constraint to ensure current_submissions is non-negative
ALTER TABLE "public"."instances"
ADD CONSTRAINT "current_submissions_non_negative" CHECK (current_submissions >= 0); 