-- Migration: Add image support to posts table
-- Run this script to add image fields to the posts table

-- Add image_url column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_url VARCHAR(500);

-- Add image_alt column for accessibility
ALTER TABLE posts ADD COLUMN IF NOT EXISTS image_alt VARCHAR(255);

-- Verify the columns were added
SELECT 'Image columns added to posts table successfully!' as status;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'posts' AND column_name IN ('image_url', 'image_alt');
