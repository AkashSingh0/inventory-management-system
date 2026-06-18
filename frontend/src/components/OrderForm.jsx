import { useEffect, useMemo, useState } from 'react';
import { getCustomers, getProducts } from '../api/api';

function OrderForm({ onSubmit, onCancel, isSubmitting }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerId, setCustomerId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, productsRes] = await Promise.all([
          getCustomers(),
          getProducts(),
        ]);
        setCustomers(customersRes.data);
        setProducts(productsRes.data);
      } catch {
        setErrors({ form: 'Failed to load customers and products.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const productsById = useMemo(
    () => Object.fromEntries(products.map((product) => [product.id, product])),
    [products],
  );

  const estimatedTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = productsById[item.product_id];
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
    [items, productsById],
  );

  const availableProducts = products.filter(
    (product) => !items.some((item) => item.product_id === product.id),
  );

  const addItem = () => {
    const nextErrors = {};

    if (!selectedProductId) nextErrors.product = 'Select a product';
    const qty = Number(quantity);
    if (!quantity || Number.isNaN(qty) || qty <= 0 || !Number.isInteger(qty)) {
      nextErrors.quantity = 'Quantity must be a positive whole number';
    }

    const product = productsById[Number(selectedProductId)];
    if (product && qty > product.quantity) {
      nextErrors.quantity = `Only ${product.quantity} units available in stock`;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setItems((prev) => [
      ...prev,
      { product_id: Number(selectedProductId), quantity: qty },
    ]);
    setSelectedProductId('');
    setQuantity('1');
    setErrors({});
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = {};

    if (!customerId) nextErrors.customer = 'Select a customer';
    if (items.length === 0) nextErrors.items = 'Add at least one product to the order';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      customer_id: Number(customerId),
      items,
    });
  };

  const fieldClass = (field) => `input ${errors[field] ? 'input-error' : ''}`;

  if (loading) {
    return <p className="py-10 text-center text-sm font-medium text-slate-500">Loading form data...</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.form && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{errors.form}</p>
      )}

      <div>
        <label htmlFor="customer" className="label">
          Customer
        </label>
        <select
          id="customer"
          value={customerId}
          onChange={(event) => {
            setCustomerId(event.target.value);
            setErrors((prev) => ({ ...prev, customer: '' }));
          }}
          className={fieldClass('customer')}
        >
          <option value="">Select customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.full_name} ({customer.email})
            </option>
          ))}
        </select>
        {errors.customer && <p className="mt-1 text-xs text-red-600">{errors.customer}</p>}
        {customers.length === 0 && (
          <p className="mt-1 text-xs text-amber-600">No customers available. Add a customer first.</p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/30 p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-800">Add Products</h3>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <div>
            <select
              value={selectedProductId}
              onChange={(event) => {
                setSelectedProductId(event.target.value);
                setErrors((prev) => ({ ...prev, product: '' }));
              }}
              className={fieldClass('product')}
            >
              <option value="">Select product</option>
              {availableProducts.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} — ${product.price.toFixed(2)} (Stock: {product.quantity})
                </option>
              ))}
            </select>
            {errors.product && <p className="mt-1 text-xs text-red-600">{errors.product}</p>}
          </div>

          <div>
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => {
                setQuantity(event.target.value);
                setErrors((prev) => ({ ...prev, quantity: '' }));
              }}
              className={`${fieldClass('quantity')} sm:w-28`}
              placeholder="Qty"
            />
            {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
          </div>

          <button type="button" onClick={addItem} className="btn-primary">
            Add
          </button>
        </div>
      </div>

      {errors.items && <p className="text-xs text-red-600">{errors.items}</p>}

      {items.length > 0 ? (
        <div className="table-wrap">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50/80">
              <tr>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-slate-500">Product</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-slate-500">Qty</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-slate-500">Price</th>
                <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase text-slate-500">Subtotal</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {items.map((item) => {
                const product = productsById[item.product_id];
                const subtotal = product ? product.price * item.quantity : 0;
                return (
                  <tr key={item.product_id}>
                    <td className="px-4 py-3 font-medium text-slate-900">{product?.name || `Product #${item.product_id}`}</td>
                    <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                    <td className="px-4 py-3 text-slate-600">${product?.price.toFixed(2) ?? '0.00'}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900">${subtotal.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => removeItem(item.product_id)} className="btn-ghost-danger">
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="border-t border-slate-100 bg-indigo-50/50 px-4 py-3 text-right text-sm">
            <span className="text-slate-600">Estimated Total: </span>
            <span className="text-lg font-bold text-indigo-600">${estimatedTotal.toFixed(2)}</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-slate-500">No products added yet.</p>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isSubmitting}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || customers.length === 0}
          className="btn-primary"
        >
          {isSubmitting ? 'Creating...' : 'Create Order'}
        </button>
      </div>
    </form>
  );
}

export default OrderForm;
