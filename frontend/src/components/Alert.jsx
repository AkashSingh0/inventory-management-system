function Alert({ type = 'info', message, onClose }) {
  if (!message) return null;

  const styles = {
    success: 'border-emerald-200/80 bg-emerald-50 text-emerald-800 shadow-emerald-100',
    error: 'border-red-200/80 bg-red-50 text-red-800 shadow-red-100',
    info: 'border-blue-200/80 bg-blue-50 text-blue-800 shadow-blue-100',
  };

  const icons = {
    success: '✓',
    error: '!',
    info: 'i',
  };

  return (
    <div
      className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm shadow-sm ${styles[type]}`}
      role="alert"
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/70 text-xs font-bold">
        {icons[type]}
      </span>
      <p className="flex-1 pt-0.5">{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-1 opacity-60 hover:bg-white/50 hover:opacity-100"
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default Alert;
