-- Add hero_image column to cities table
ALTER TABLE cities ADD COLUMN hero_image text;

-- Update cities with appropriate hero images
UPDATE cities SET hero_image = 'https://images.unsplash.com/photo-1548834925-e48f8a27ae6f?w=1920&h=1200&fit=crop' WHERE slug = 'spb';
UPDATE cities SET hero_image = 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=1920&h=1200&fit=crop' WHERE slug = 'moscow';
UPDATE cities SET hero_image = 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&h=1200&fit=crop' WHERE slug = 'dubai';