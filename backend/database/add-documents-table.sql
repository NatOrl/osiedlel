-- Add documents table for Task 3: Document Library
-- This script can be run on an existing database to add the documents table

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
