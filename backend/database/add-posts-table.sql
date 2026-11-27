-- Migration: Add posts table for announcements
-- Run this script to add the posts table to your existing database

-- Posts/Announcements table
CREATE TABLE IF NOT EXISTS posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    summary TEXT,
    content TEXT NOT NULL,
    published_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample announcements data
INSERT INTO posts (title, category, summary, content, published_date) VALUES
    ('Zebranie Mieszkańców - Marzec 2026', 'Spotkanie', 'Zapraszamy na comiesięczne zebranie mieszkańców, aby omówić nadchodzące projekty i inicjatywy.', 'Spotkanie odbędzie się w centrum osiedlowym o godzinie 18:00. Wszyscy mieszkańcy są mile widziani.', '2026-03-25'),
    ('Aktualizacja Harmonogramu Konserwacji', 'Konserwacja', 'Zaplanowane prace konserwacyjne obiektów budynku.', 'Informujemy, że rutynowa konserwacja zostanie przeprowadzona w dniach 28-29 marca.', '2026-03-20'),
    ('Nowe Przepisy Parkingowe', 'Regulamin', 'Ważne aktualizacje zasad parkowania obowiązujące od 1 kwietnia.', 'Wymagane będą nowe przepustki parkingowe. Prosimy o kontakt z biurem administracji w celu uzyskania szczegółów.', '2026-03-15');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_published_date ON posts(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Trigger to automatically update updated_at for posts
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created
SELECT 'Posts table created successfully!' as status;
SELECT COUNT(*) as total_posts FROM posts;
