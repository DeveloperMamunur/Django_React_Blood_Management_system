import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const colors = {
  success: "bg-green-50 border-green-400 text-green-700 dark:bg-green-800/40 dark:text-green-100 dark:border-green-600",
  error: "bg-red-50 border-red-400 text-red-700 dark:bg-red-800/40 dark:text-red-100 dark:border-red-600",
  warning: "bg-yellow-50 border-yellow-400 text-yellow-800 dark:bg-yellow-800/40 dark:text-yellow-100 dark:border-yellow-600",
  info: "bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-800/40 dark:text-blue-100 dark:border-blue-600",
};

export function ToastContainer({ toasts, removeToast }) {
  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), toast.duration || 3000)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [toasts, removeToast]);

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 items-end">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between min-w-[250px] max-w-[320px] px-4 py-3 border rounded-lg shadow-md transition-all duration-300 transform animate-slideIn ${colors[toast.type] || colors.info}`}
        >
          <div className="flex items-center gap-3">
            {icons[toast.type] || icons.info}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-2 hover:opacity-75 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(50%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slideIn {
            animation: slideIn 0.3s ease-out;
          }
        `}
      </style>
    </div>
  );
}
