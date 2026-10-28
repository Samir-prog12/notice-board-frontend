export function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function isExpired(iso) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return !Number.isNaN(t) && t < Date.now();
}

// Backend "2026-10-27T10:30:00" -> <input type="datetime-local"> "2026-10-27T10:30"
export function toInputValue(iso) {
  return iso ? String(iso).slice(0, 16) : '';
}

// <input type="datetime-local"> value -> format Spring's LocalDateTime accepts
export function toApiValue(value) {
  if (!value) return null;
  return value.length === 16 ? `${value}:00` : value;
}

// true when the date is within the last `hours` hours (used for the "New" badge)
export function isRecent(iso, hours = 24) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return !Number.isNaN(t) && Date.now() - t < hours * 3600 * 1000;
}
