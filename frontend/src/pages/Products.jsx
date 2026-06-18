import { useCallback, useEffect, useState } from 'react';
import {
  createProduct,
  deleteProduct,
  getErrorMessage,
  getProducts,
  updateProduct,
} from '../api/api';
import Alert from '../components/Alert';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import ProductForm from '../components/ProductForm';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getProducts();
      setProducts(response.data);
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
        const response = await getProducts();
        if (isMounted) setProducts(response.data);
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

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
    setSuccess('');
    setError('');
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
    setSuccess('');
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        setSuccess('Product updated successfully.');
      } else {
        await createProduct(formData);
        setSuccess('Product created successfully.');
      }
      closeModal();
      await fetchProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete product "${product.name}"?`)) return;

    setDeletingId(product.id);
    setError('');
    setSuccess('');
    try {
      await deleteProduct(product.id);
      setSuccess('Product deleted successfully.');
      await fetchProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product inventory and stock levels"
        action={
          <button type="button" onClick={openCreateModal} className="btn-primary">
            + Add Product
          </button>
        }
      />

      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner label="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products yet"
          description="Get started by adding your first product to the inventory."
          action={
            <button type="button" onClick={openCreateModal} className="btn-primary">
              + Add Product
            </button>
          }
        />
      ) : (
        <div className="table-wrap">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100 text-sm">
              <thead className="bg-slate-50/80">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">SKU</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Quantity</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {products.map((product) => (
                  <tr key={product.id} className="transition hover:bg-indigo-50/30">
                    <td className="px-5 py-4 font-semibold text-slate-900">{product.name}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600">
                        {product.sku}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">${product.price.toFixed(2)}</td>
                    <td className="px-5 py-4">
                      <span className={product.quantity < 5 ? 'badge-warning' : 'badge-success'}>
                        {product.quantity}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => openEditModal(product)} className="btn-ghost-indigo">
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          className="btn-ghost-danger disabled:opacity-50"
                        >
                          {deletingId === product.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
      >
        <ProductForm
          key={editingProduct?.id ?? 'new'}
          product={editingProduct}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          isSubmitting={isSubmitting}
        />
      </Modal>
    </div>
  );
}

export default Products;
