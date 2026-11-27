import { useState, useEffect } from 'react';
import './Employees.css';

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/employees');
      const result = await response.json();

      if (response.ok && result.success) {
        setEmployees(result.data);
      } else {
        setError(result.error || 'Nie udało się pobrać listy pracowników');
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employees-page">
      <div className="page-header">
        <h1 className="page-title">Pracownicy administracji</h1>
        <p className="page-description">
          Pełna lista pracowników administracji osiedla wraz z zakresem obowiązków i danymi kontaktowymi
        </p>
      </div>

      {loading && (
        <div className="employees-status">
          <p>Ładowanie listy pracowników...</p>
        </div>
      )}

      {error && (
        <div className="employees-status employees-status-error">
          <h3>Błąd ładowania listy pracowników</h3>
          <p>{error}</p>
          <button onClick={fetchEmployees} className="employees-retry-btn">
            Spróbuj ponownie
          </button>
        </div>
      )}

      {!loading && !error && employees.length === 0 && (
        <div className="employees-status">
          <p>Brak pracowników do wyświetlenia.</p>
        </div>
      )}

      {!loading && !error && employees.length > 0 && (
        <div className="employees-list">
          {employees.map((employee) => (
            <article key={employee.id} className="employees-list-card">
              <div className="employees-list-avatar" aria-hidden="true">
                {employee.full_name.charAt(0)}
              </div>
              <div className="employees-list-info">
                <h2 className="employees-list-name">{employee.full_name}</h2>
                <p className="employees-list-position">{employee.position}</p>
                {employee.responsibilities && (
                  <p className="employees-list-responsibilities">
                    <strong>Zakres obowiązków:</strong> {employee.responsibilities}
                  </p>
                )}
              </div>
              <div className="employees-list-contact">
                {employee.phone && (
                  <a href={`tel:${employee.phone.replace(/\s/g, '')}`}>📞 {employee.phone}</a>
                )}
                {employee.email && (
                  <a href={`mailto:${employee.email}`}>✉️ {employee.email}</a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default Employees;
