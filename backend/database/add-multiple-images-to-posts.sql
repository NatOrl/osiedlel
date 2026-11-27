-- Migration: Add support for multiple images to posts table
-- This replaces the single image_url/image_alt with an images array

-- Drop old single image columns if they exist
ALTER TABLE posts DROP COLUMN IF EXISTS image_url;
ALTER TABLE posts DROP COLUMN IF EXISTS image_alt;

-- Add new images column as JSONB array
-- Each image will be stored as: {"url": "/uploads/...", "alt": "description"}
ALTER TABLE posts ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Create an index on the images column for better query performance
CREATE INDEX IF NOT EXISTS idx_posts_images ON posts USING GIN (images);

-- Verify the changes
SELECT 'Multiple images support added to posts table successfully!' as status;
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'posts' AND column_name = 'images';
