import React from "react";

export default function Select({
  id,
  label,
  value = "",
  onChange,
  options = [],
  required = false,
  disabled = false,
  error = "",
  className = "",
}) {
  const selectId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={selectId}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        } ${error ? "border-red-500" : ""} ${className}`}
      >
        <option value="" disabled>
          Select...
        </option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
