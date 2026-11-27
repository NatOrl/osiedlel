-- Create database (run this first)
-- CREATE DATABASE osiedlel;

-- Connect to the database and run the following:

-- Example table: items
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example: Insert sample data
INSERT INTO items (name, description) VALUES
    ('Sample Item 1', 'This is the first sample item'),
    ('Sample Item 2', 'This is the second sample item'),
    ('Sample Item 3', 'This is the third sample item');

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_posts_published_date ON posts(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);

-- Trigger to automatically update updated_at for posts
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Documents table for Task 3: Document Library
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size INTEGER,
    uploaded_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample documents data
INSERT INTO documents (title, description, category, file_url, file_name, file_size, uploaded_date) VALUES
    ('Statut Osiedla 2026', 'Oficjalne przepisy i regulamin osiedla', 'Regulaminy Ogólne', '/documents/statut-osiedla-2026.pdf', 'statut-osiedla-2026.pdf', 245000, '2026-01-15'),
    ('Regulamin Porządku Domowego', 'Wytyczne dla mieszkańców', 'Regulaminy Ogólne', '/documents/regulamin-porzadku-domowego.pdf', 'regulamin-porzadku-domowego.pdf', 180000, '2026-01-10'),
    ('Formularz Zgłoszenia Usterki', 'Zgłoś prośby o konserwację', 'Formularze', '/documents/formularz-zgloszenia-usterki.pdf', 'formularz-zgloszenia-usterki.pdf', 95000, '2026-02-01'),
    ('Wniosek o Przepustkę Parkingową', 'Złóż wniosek o przepustki parkingowe', 'Formularze', '/documents/wniosek-przepustka-parkingowa.pdf', 'wniosek-przepustka-parkingowa.pdf', 120000, '2026-03-01'),
    ('Budżet Roczny 2026', 'Przegląd budżetu osiedla', 'Raporty Finansowe', '/documents/budzet-roczny-2026.pdf', 'budzet-roczny-2026.pdf', 320000, '2026-01-05'),
    ('Raport Finansowy Q1', 'Podsumowanie finansowe pierwszego kwartału', 'Raporty Finansowe', '/documents/raport-finansowy-q1-2026.pdf', 'raport-finansowy-q1-2026.pdf', 280000, '2026-03-20');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_date ON documents(uploaded_date DESC);

-- Trigger to automatically update updated_at for documents
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
