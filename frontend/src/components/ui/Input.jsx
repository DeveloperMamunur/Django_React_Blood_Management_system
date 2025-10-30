import React, { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      id,
      label,
      type = "text",
      placeholder = "",
      value = "",
      onChange,
      required = false,
      disabled = false,
      error = "",
      className = "",
    },
    ref
  ) => {
    const inputId = id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all ${
            disabled ? "opacity-60 cursor-not-allowed" : ""
          } ${error ? "border-red-500" : ""} ${className}`}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
