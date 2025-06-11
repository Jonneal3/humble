-- Remove submission tracking columns since we're handling this locally
ALTER TABLE instances
DROP COLUMN IF EXISTS current_submissions,
DROP COLUMN IF EXISTS last_submission_at;

-- Update the comment on the table to reflect the change
COMMENT ON TABLE instances IS 'Stores widget instances with their configuration and settings'; 