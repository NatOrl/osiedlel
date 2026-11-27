// Parses either a plain "YYYY-MM-DD" date (treated as a local date, no timezone shift)
// or any other value understood by the Date constructor (e.g. ISO timestamps).
export function parseDate(value) {
  if (!value) return null;
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// e.g. "25 listopada 2026"
export function formatDate(value) {
  const date = parseDate(value);
  if (!date) return '';
  return date.toLocaleDateString('pl-PL', { year: 'numeric', month: 'long', day: 'numeric' });
}

// e.g. "25.11.2026"
export function formatDateShort(value) {
  const date = parseDate(value);
  if (!date) return '';
  return date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
