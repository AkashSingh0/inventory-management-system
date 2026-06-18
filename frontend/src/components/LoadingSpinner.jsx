function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="h-12 w-12 rounded-full border-4 border-slate-200" />
        <div
          className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-indigo-600"
          role="status"
          aria-label={label}
        />
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

export default LoadingSpinner;
