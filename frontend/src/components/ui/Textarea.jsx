import React from "react";

export default function Textarea({
  id,
  label,
  value = "",
  onChange,
  placeholder = "",
  required = false,
  rows = 4,
  disabled = false,
  error = "",
  className = "",
}) {
  const textareaId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={textareaId}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        } ${error ? "border-red-500" : ""} ${className}`}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
