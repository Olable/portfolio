export function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export function formatDateRange(start, end, current) {
  const opts = { year: 'numeric', month: 'short' };
  const s = new Date(start).toLocaleDateString('en-US', opts);
  const e = current ? 'Present' : (end ? new Date(end).toLocaleDateString('en-US', opts) : '');
  return `${s} — ${e}`;
}
