function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-lg animate-[fadeIn_0.2s_ease-out] rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
