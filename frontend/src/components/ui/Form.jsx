import React from "react";

export default function Form({ onSubmit, children, className = "" }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 ${className}`}
    >
      <div className="space-y-4">{children}</div>
    </form>
  );
}
