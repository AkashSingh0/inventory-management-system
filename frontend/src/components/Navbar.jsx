import { Link } from 'react-router-dom';

function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden"
            aria-label="Toggle navigation menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition group-hover:shadow-indigo-500/40">
              IM
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold tracking-tight text-slate-900">Inventory Manager</p>
              <p className="text-xs text-slate-500">Smart inventory control</p>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
          <span className="hidden text-xs font-medium text-emerald-700 sm:inline">API Connected</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
