import { useCallback, useEffect, useState } from 'react';
import { createCustomer, deleteCustomer, getCustomers, getErrorMessage } from '../api/api';
import Alert from '../components/Alert';
import CustomerForm from '../components/CustomerForm';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getCustomers();
      setCustomers(response.data);
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
        const response = await getCustomers();
        if (isMounted) setCustomers(response.data);
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

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      await createCustomer(formData);
      setSuccess('Customer created successfully.');
      setIsModalOpen(false);
      await fetchCustomers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (customer) => {
    if (!window.confirm(`Delete customer "${customer.full_name}"?`)) return;

    setDeletingId(customer.id);
    setError('');
    setSuccess('');
    try {
      await deleteCustomer(customer.id);
      setSuccess('Customer deleted successfully.');
      await fetchCustomers();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Manage your customer database and contacts"
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
            + Add Customer
          </button>
        }
      />

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner label="Loading customers..." />
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Add your first customer to start creating orders."
          action={
            <button type="button" onClick={() => setIsModalOpen(true)} className="btn-primary">
              + Add Customer
            </button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {customers.map((customer) => (
            <div key={customer.id} className="card card-hover p-6">
              <div className="mb-5 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold text-white shadow-lg shadow-indigo-500/25">
                  {customer.full_name.charAt(0).toUpperCase()}
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(customer)}
                  disabled={deletingId === customer.id}
                  className="btn-ghost-danger disabled:opacity-50"
                >
                  {deletingId === customer.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{customer.full_name}</h3>
              <p className="mt-2 text-sm text-slate-500">{customer.email}</p>
              <p className="mt-1 text-sm font-medium text-slate-600">{customer.phone}</p>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Customer">
        <CustomerForm
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}

export default Customers;
