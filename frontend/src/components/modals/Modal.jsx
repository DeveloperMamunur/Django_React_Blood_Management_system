export default function Modal({
  isOpen,
  onClose,
  title,
  modalSize = "lg",
  overlayClass,
  children,
}) {
  if (!isOpen) return null;

  const sizeClass =
    {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "3xl": "max-w-3xl",
      "4xl": "max-w-4xl",
    }[modalSize] || "max-w-md";

  const overlayClassName =
    overlayClass ||
    "bg-black/60 dark:bg-black/40 backdrop-blur-sm";

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 ${overlayClassName}`}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg w-full ${sizeClass} max-h-[90vh] shadow-lg flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="text-xl text-amber-50 font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 dark:hover:text-gray-300"
          >
            ✖
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto flex-1 text-gray-700 dark:text-gray-300">{children}</div>
      </div>
    </div>
  );
}
