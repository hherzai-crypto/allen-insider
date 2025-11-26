-- Add email verification fields to subscribers table
ALTER TABLE subscribers
  ALTER COLUMN status DROP DEFAULT,
  ALTER COLUMN status SET DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS verification_token TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP,
  ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex');

-- Update status check to include 'pending'
ALTER TABLE subscribers
  DROP CONSTRAINT IF EXISTS subscribers_status_check;

ALTER TABLE subscribers
  ADD CONSTRAINT subscribers_status_check
  CHECK (status IN ('pending', 'active', 'unsubscribed', 'bounced'));

-- Create index for verification token lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_verification_token ON subscribers(verification_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_unsubscribe_token ON subscribers(unsubscribe_token);
