import React from 'react';
import { statusToVariant, badgeClassFor } from '../../utils/badgeUtils';

export default function Badge({
  status = 'neutral',
  label,
  mode = 'solid',
  size = 'md',
  icon,
  pill = true,
  className = '',
  ...rest
}) {
  const variant = statusToVariant(status);
  const classes = badgeClassFor(status, mode, size);
  const shape = pill ? 'rounded-full' : 'rounded-md';

  return (
    <span
      role="status"
      aria-label={typeof label === 'string' ? label : variant.label}
      className={`${classes} ${shape} ${className}`}
      {...rest}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      <span className="whitespace-nowrap">{label ?? variant.label}</span>
    </span>
  );
}
