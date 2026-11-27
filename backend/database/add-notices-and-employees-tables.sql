-- Migration: Add "Ważne komunikaty" (important notices) and employees tables
-- Used by the home page (important notices, estate administration intro)
-- and by the employee directory page.

-- Make sure the helper function used by the triggers exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Important notices (water/electricity interruptions, maintenance, parking, office hours, ...)
-- A notice is shown on the home page from published_date until valid_until (inclusive).
-- valid_until = NULL means "valid until revoked".
CREATE TABLE IF NOT EXISTS important_notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT NOT NULL,
    published_date DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT important_notices_validity_check CHECK (valid_until IS NULL OR valid_until >= valid_from)
);

CREATE INDEX IF NOT EXISTS idx_important_notices_dates ON important_notices(published_date DESC, valid_until);

DROP TRIGGER IF EXISTS update_important_notices_updated_at ON important_notices;
CREATE TRIGGER update_important_notices_updated_at BEFORE UPDATE ON important_notices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Estate administration employees
-- is_featured = TRUE -> employee is shown in the short introduction on the home page
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    responsibilities TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data (inserted only when the tables are empty). Replace with real data.
INSERT INTO important_notices (title, category, description, published_date, valid_from, valid_until)
SELECT * FROM (VALUES
    ('Planowana przerwa w dostawie wody', 'Woda',
     'W związku z pracami na sieci wodociągowej woda zostanie wyłączona w godzinach 9:00–15:00. Prosimy o zgromadzenie niezbędnego zapasu wody.',
     CURRENT_DATE, CURRENT_DATE + 2, CURRENT_DATE + 2),
    ('Ograniczenia w parkowaniu na terenie osiedla', 'Parking',
     'Ze względu na prace porządkowe i malowanie oznakowania poziomego prosimy o niepozostawianie pojazdów na wyznaczonych odcinkach parkingu.',
     CURRENT_DATE - 1, CURRENT_DATE, CURRENT_DATE + 7),
    ('Zmiana godzin pracy biura administracji', 'Godziny pracy biura',
     'W okresie świątecznym biuro administracji będzie czynne w skróconych godzinach. Szczegóły dostępne w biurze oraz telefonicznie.',
     CURRENT_DATE - 2, CURRENT_DATE + 14, CURRENT_DATE + 21)
) AS sample(title, category, description, published_date, valid_from, valid_until)
WHERE NOT EXISTS (SELECT 1 FROM important_notices);

INSERT INTO employees (full_name, position, responsibilities, phone, email, is_featured, sort_order)
SELECT * FROM (VALUES
    ('Anna Nowak', 'Kierownik administracji osiedla',
     'Zarządzanie osiedlem, nadzór nad pracą administracji, sprawy mieszkańców i współpraca z Radą Osiedla.',
     '503 074 873', 'administracja@osiedlelazarz.pl', TRUE, 1),
    ('Piotr Kowalski', 'Instalator',
     'Awarie instalacji wodno-kanalizacyjnych i centralnego ogrzewania, przeglądy techniczne.',
     '501 327 815', NULL, TRUE, 2),
    ('Marek Wiśniewski', 'Elektryk',
     'Awarie instalacji elektrycznych w częściach wspólnych, oświetlenie klatek schodowych i terenu osiedla.',
     '501 037 856', NULL, TRUE, 3),
    ('Ewa Zielińska', 'Referent ds. rozliczeń',
     'Rozliczenia opłat, ewidencja mieszkańców, wydawanie zaświadczeń i obsługa wniosków.',
     '61 234 56 78', 'biuro@osiedlelazarz.pl', FALSE, 4),
    ('Tomasz Lewandowski', 'Specjalista ds. technicznych',
     'Planowanie remontów i konserwacji, odbiory prac, zgłoszenia usterek w częściach wspólnych.',
     '61 234 56 78', 'administracja@osiedlelazarz.pl', FALSE, 5)
) AS sample(full_name, position, responsibilities, phone, email, is_featured, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM employees);

-- Verify
SELECT 'Important notices and employees tables created successfully!' as status;
SELECT COUNT(*) as total_notices FROM important_notices;
SELECT COUNT(*) as total_employees FROM employees;
