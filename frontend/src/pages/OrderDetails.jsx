import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCustomer, getErrorMessage, getOrder, getProducts } from '../api/api';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import PageHeader from '../components/PageHeader';

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const [orderRes, productsRes] = await Promise.all([getOrder(id), getProducts()]);
        const orderData = orderRes.data;
        if (!isMounted) return;

        setOrder(orderData);
        setProducts(productsRes.data);

        try {
          const customerRes = await getCustomer(orderData.customer_id);
          if (isMounted) setCustomer(customerRes.data);
        } catch {
          if (isMounted) setCustomer(null);
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
  }, [id]);

  const productsById = Object.fromEntries(products.map((product) => [product.id, product]));

  if (loading) {
    return <LoadingSpinner label="Loading order details..." />;
  }

  if (error) {
    return (
      <div>
        <Link to="/orders" className="btn-ghost-indigo mb-6 inline-flex">
          ← Back to Orders
        </Link>
        <Alert type="error" message={error} />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div>
      <Link to="/orders" className="btn-ghost-indigo mb-6 inline-flex">
        ← Back to Orders
      </Link>

      <PageHeader
        title={`Order #${order.id}`}
        description="Order details and line items"
      />

      <div className="mb-6 grid gap-5 sm:grid-cols-2">
        <div className="card p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Customer</p>
          <p className="mt-2 text-xl font-bold text-slate-900">
            {customer ? customer.full_name : `Customer #${order.customer_id}`}
          </p>
          {customer && (
            <>
              <p className="mt-2 text-sm text-slate-500">{customer.email}</p>
              <p className="text-sm text-slate-500">{customer.phone}</p>
            </>
          )}
        </div>

        <div className="card relative overflow-hidden p-6">
          <div className="stat-card-glow bg-indigo-500" />
          <p className="relative text-xs font-semibold uppercase tracking-wider text-slate-400">Total Amount</p>
          <p className="relative mt-2 text-4xl font-bold tracking-tight text-indigo-600">
            ${order.total_amount.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="table-wrap">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-bold text-slate-900">Order Items</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Product</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">SKU</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Quantity</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Unit Price</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {order.items.map((item) => {
                const product = productsById[item.product_id];
                const subtotal = item.price * item.quantity;
                return (
                  <tr key={item.id} className="hover:bg-indigo-50/30">
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {product?.name || `Product #${item.product_id}`}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                        {product?.sku || '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.quantity}</td>
                    <td className="px-5 py-4 text-slate-600">${item.price.toFixed(2)}</td>
                    <td className="px-5 py-4 font-bold text-slate-900">${subtotal.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-50/80">
              <tr>
                <td colSpan={4} className="px-5 py-4 text-right text-sm font-semibold uppercase tracking-wider text-slate-500">
                  Total
                </td>
                <td className="px-5 py-4 text-lg font-bold text-indigo-600">
                  ${order.total_amount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
