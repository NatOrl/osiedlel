-- Employee Duties table for managing home duties of estate employees
CREATE TABLE IF NOT EXISTS employee_duties (
    id SERIAL PRIMARY KEY,
    duty_dates VARCHAR(100) NOT NULL,
    employees JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default data
INSERT INTO employee_duties (duty_dates, employees) VALUES
    ('28-29.03.2026', '[
        {"role": "Instalator", "phone": "501 327 815"},
        {"role": "Elektryk", "phone": "501 037 856"},
        {"role": "Kierownik", "phone": "503 074 873"}
    ]'::jsonb);

-- Trigger to automatically update updated_at for employee_duties
CREATE TRIGGER update_employee_duties_updated_at BEFORE UPDATE ON employee_duties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
