-- Create contact_messages table for Task 5: Contact System
-- This table stores all contact form submissions from residents

CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER trigger_update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_messages_updated_at();

-- Insert sample data for testing
INSERT INTO contact_messages (name, email, subject, message, status) VALUES
('Jan Kowalski', 'jan.kowalski@example.com', 'Pytanie o opłaty', 'Dzień dobry, chciałbym zapytać o wysokość opłat za bieżący miesiąc.', 'new'),
('Anna Nowak', 'anna.nowak@example.com', 'Problem z windą', 'Winda w budynku B nie działa od wczoraj. Proszę o interwencję.', 'in_progress'),
('Piotr Wiśniewski', 'piotr.wisniewski@example.com', 'Zgłoszenie awarii', 'Brak ciepłej wody w mieszkaniu 45.', 'resolved');

SELECT 'Contact messages table created successfully!' as message;
