import React from "react";

export default function Textarea({ label, value, onChange, placeholder, disabled = false, error = "", className = "" }) {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition
          border-gray-300 dark:border-gray-700
          bg-white dark:bg-gray-800
          text-gray-800 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-500
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? "border-red-500 focus:ring-red-500" : ""}
          ${className}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
