import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createOrder, deleteOrder, getCustomers, getErrorMessage, getOrders } from '../api/api';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import OrderForm from '../components/OrderForm';
import PageHeader from '../components/PageHeader';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersRes, customersRes] = await Promise.all([getOrders(), getCustomers()]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
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
        const [ordersRes, customersRes] = await Promise.all([getOrders(), getCustomers()]);
        if (isMounted) {
          setOrders(ordersRes.data);
          setCustomers(customersRes.data);
        }
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

  const customersById = Object.fromEntries(
    customers.map((customer) => [customer.id, customer]),
  );

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const response = await createOrder(formData);
      setSuccess(
        `Order #${response.data.id} created successfully. Total: $${response.data.total_amount.toFixed(2)}`,
      );
      setIsModalOpen(false);
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (order) => {
    if (!window.confirm(`Delete order #${order.id}?`)) return;

    setDeletingId(order.id);
    setError('');
    setSuccess('');
    try {
      await deleteOrder(order.id);
      setSuccess('Order deleted successfully.');
      await fetchData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Create and manage customer orders"
        action={
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              setSuccess('');
              setError('');
            }}
            className="btn-primary"
          >
            + Create Order
          </button>
        }
      />

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner label="Loading orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          description="Create your first order by selecting a customer and products."
          action={
            <button type="button" onClick={() => setIsModalOpen(true)} className="btn-primary">
              + Create Order
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Order ID</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Customer</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Total Amount</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {orders.map((order) => {
                  const customer = customersById[order.customer_id];
                  return (
                    <tr key={order.id} className="transition hover:bg-indigo-50/30">
                      <td className="px-5 py-4">
                        <span className="font-bold text-indigo-600">#{order.id}</span>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-700">
                        {customer ? customer.full_name : `Customer #${order.customer_id}`}
                      </td>
                      <td className="px-5 py-4 text-lg font-bold text-slate-900">
                        ${order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex justify-end gap-1">
                          <Link to={`/orders/${order.id}`} className="btn-ghost-indigo">
                            View
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(order)}
                            disabled={deletingId === order.id}
                            className="btn-ghost-danger disabled:opacity-50"
                          >
                            {deletingId === order.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Order">
        <OrderForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}

export default Orders;
