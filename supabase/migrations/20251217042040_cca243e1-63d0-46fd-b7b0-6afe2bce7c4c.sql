-- Add city_id column to company_stats for city-specific statistics
ALTER TABLE company_stats ADD COLUMN city_id UUID REFERENCES cities(id);

-- Create index for faster queries
CREATE INDEX idx_company_stats_city_id ON company_stats(city_id);