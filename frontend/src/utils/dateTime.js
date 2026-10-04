// Date/time helpers.
// The backend stores timestamps in UTC but often serializes them WITHOUT a
// timezone suffix (e.g. "2026-10-04T12:51:12"). Browsers parse such strings as
// LOCAL time, which shows receipts 7 hours behind in Cambodia. These helpers
// treat zone-less timestamps as UTC and render them in Cambodia time.

export const APP_TIME_ZONE = 'Asia/Phnom_Penh';

export const parseServerDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return isNaN(value) ? null : value;
  if (typeof value === 'number') return new Date(value);

  let str = String(value).trim();
  // ISO-like string without "Z" or "+hh:mm" offset -> assume UTC
  const isIsoLike = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(str);
  const hasZone = /(Z|[+-]\d{2}:?\d{2})$/i.test(str);
  if (isIsoLike && !hasZone) {
    str = str.replace(' ', 'T') + 'Z';
  }
  const d = new Date(str);
  return isNaN(d) ? null : d;
};

// e.g. "04/10/2026, 7:51 PM"
export const formatDateTime = (value, { seconds = false } = {}) => {
  const d = parseServerDate(value);
  if (!d) return '';
  return d.toLocaleString('en-GB', {
    timeZone: APP_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    ...(seconds ? { second: '2-digit' } : {}),
    hour12: true,
  }).replace(/\b(am|pm)\b/i, (m) => m.toUpperCase());
};

// e.g. "04/10/2026"
export const formatDate = (value) => {
  const d = parseServerDate(value);
  if (!d) return '';
  return d.toLocaleDateString('en-GB', { timeZone: APP_TIME_ZONE, day: '2-digit', month: '2-digit', year: 'numeric' });
};

// e.g. "7:51 PM"
export const formatTime = (value) => {
  const d = parseServerDate(value);
  if (!d) return '';
  return d.toLocaleTimeString('en-US', { timeZone: APP_TIME_ZONE, hour: 'numeric', minute: '2-digit', hour12: true });
};
