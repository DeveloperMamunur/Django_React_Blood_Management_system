export const STATUS_VARIANTS = {
  success: { label: 'Success', color: 'green' },
  danger: { label: 'Danger', color: 'red' },
  warning: { label: 'Warning', color: 'yellow' },
  info: { label: 'Info', color: 'blue' },
  neutral: { label: 'Neutral', color: 'gray' },
  low: { label: 'Low', color: 'yellow' },
  urgent: { label: 'Urgent', color: 'red' },
  emergency: { label: 'Emergency', color: 'red' },
  confirmed: { label: 'Confirmed', color: 'green' },
};

export function statusToVariant(status) {
  if (!status) return STATUS_VARIANTS.neutral;
  const key = String(status).toLowerCase();
  return STATUS_VARIANTS[key] || { label: String(status), color: 'gray' };
}

export function badgeClassFor(status, mode = 'solid', size = 'md') {
  const { color } = statusToVariant(status);

  const sizeMap = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };
  const baseSize = sizeMap[size] || sizeMap.md;

  if (mode === 'outline') {
    return `inline-flex items-center gap-2 rounded-full border border-${color}-300 text-${color}-700 bg-transparent ${baseSize}`;
  }
  if (mode === 'subtle') {
    return `inline-flex items-center gap-2 rounded-full bg-${color}-100 text-${color}-800 ${baseSize}`;
  }

  // solid mode (default)
  return `inline-flex items-center gap-2 rounded-full bg-${color}-600 text-white ${baseSize}`;
}