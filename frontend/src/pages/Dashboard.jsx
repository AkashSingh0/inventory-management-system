import { useCallback, useEffect, useState } from 'react';
import { getDashboard, getErrorMessage } from '../api/api';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';

const statCards = [
  {
    key: 'total_products',
    label: 'Total Products',
    glow: 'bg-indigo-500',
    iconBg: 'bg-indigo-100 text-indigo-600',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    key: 'total_customers',
    label: 'Total Customers',
    glow: 'bg-emerald-500',
    iconBg: 'bg-emerald-100 text-emerald-600',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'total_orders',
    label: 'Total Orders',
    glow: 'bg-violet-500',
    iconBg: 'bg-violet-100 text-violet-600',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    key: 'low_stock_products',
    label: 'Low Stock Products',
    glow: 'bg-amber-500',
    iconBg: 'bg-amber-100 text-amber-600',
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getDashboard();
      setStats(response.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await getDashboard();
        if (isMounted) setStats(response.data);
      } catch (err) {
        if (isMounted) setError(getErrorMessage(err));
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Real-time overview of your inventory operations"
        action={
          <button type="button" onClick={fetchDashboard} disabled={loading} className="btn-secondary">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        }
      />

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner label="Loading dashboard..." />
      ) : stats ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.key} className="stat-card">
              <div className={`stat-card-glow ${card.glow}`} />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{card.label}</p>
                  <p className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                    {stats[card.key]}
                  </p>
                </div>
                <div className={`rounded-2xl p-3.5 ${card.iconBg}`}>{card.icon}</div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
