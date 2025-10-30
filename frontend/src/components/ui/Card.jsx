import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, className = "" }) {
  return (
    <div className={`border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`text-gray-800 dark:text-gray-200 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = "" }) {
  return (
    <div
      className={`mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end ${className}`}
    >
      {children}
    </div>
  );
}
