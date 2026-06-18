import { useState } from 'react';

const emptyForm = {
  name: '',
  sku: '',
  price: '',
  quantity: '',
};

function getFormFromProduct(product) {
  if (!product) return emptyForm;
  return {
    name: product.name || '',
    sku: product.sku || '',
    price: String(product.price ?? ''),
    quantity: String(product.quantity ?? ''),
  };
}

function ProductForm({ product, onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(() => getFormFromProduct(product));
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) nextErrors.name = 'Name is required';
    if (!form.sku.trim()) nextErrors.sku = 'SKU is required';

    const price = Number(form.price);
    if (form.price === '' || Number.isNaN(price) || price <= 0) {
      nextErrors.price = 'Price must be greater than 0';
    }

    const quantity = Number(form.quantity);
    if (form.quantity === '' || Number.isNaN(quantity) || quantity < 0 || !Number.isInteger(quantity)) {
      nextErrors.quantity = 'Quantity must be a whole number of 0 or more';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
  };

  const inputClass = (field) => `input ${errors[field] ? 'input-error' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="label">
          Name
        </label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          className={inputClass('name')}
          placeholder="Product name"
        />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="sku" className="label">
          SKU
        </label>
        <input
          id="sku"
          name="sku"
          value={form.sku}
          onChange={handleChange}
          className={inputClass('sku')}
          placeholder="SKU-001"
        />
        {errors.sku && <p className="mt-1 text-xs text-red-600">{errors.sku}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="label">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className={inputClass('price')}
            placeholder="0.00"
          />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>

        <div>
          <label htmlFor="quantity" className="label">
            Quantity
          </label>
          <input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            step="1"
            value={form.quantity}
            onChange={handleChange}
            className={inputClass('quantity')}
            placeholder="0"
          />
          {errors.quantity && <p className="mt-1 text-xs text-red-600">{errors.quantity}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
