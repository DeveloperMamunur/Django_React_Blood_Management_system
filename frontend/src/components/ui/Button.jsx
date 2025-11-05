import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}) {
  const base =
    "font-semibold rounded transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 active:scale-95";

  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 focus:ring-blue-500/50",
    secondary:
      "bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/30 dark:shadow-purple-500/20 focus:ring-purple-500/50",
    outline:
      "border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 focus:ring-gray-500/30",
    danger:
      "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg shadow-red-500/30 dark:shadow-red-500/20 focus:ring-red-500/50",
    success:
      "bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/20 focus:ring-emerald-500/50",
    warning:
      "bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white shadow-lg shadow-yellow-500/30 dark:shadow-yellow-500/20 focus:ring-yellow-500/50",
    ghost:
      "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500/30",
  };

  const sizes = {
    xs: 'px-3 py-2 text-xs',
    sm: 'px-4 py-3 text-sm', 
    md: 'px-7 py-3 text-base', 
    lg: 'px-9 py-4 text-lg', 
    xl: 'px-11 py-4 text-xl' 
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
