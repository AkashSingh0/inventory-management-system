import { useState } from 'react';

const initialForm = {
  full_name: '',
  email: '',
  phone: '',
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function CustomerForm({ onSubmit, onCancel, isSubmitting }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const nextErrors = {};

    if (!form.full_name.trim()) nextErrors.full_name = 'Full name is required';
    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address';
    }
    if (!form.phone.trim()) nextErrors.phone = 'Phone is required';

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
      full_name: form.full_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
  };

  const inputClass = (field) => `input ${errors[field] ? 'input-error' : ''}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="label">
          Full Name
        </label>
        <input
          id="full_name"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          className={inputClass('full_name')}
          placeholder="John Doe"
        />
        {errors.full_name && <p className="mt-1 text-xs text-red-600">{errors.full_name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className={inputClass('email')}
          placeholder="john@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="label">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className={inputClass('phone')}
          placeholder="+1 555 0100"
        />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <button type="button" onClick={onCancel} className="btn-secondary" disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving...' : 'Add Customer'}
        </button>
      </div>
    </form>
  );
}

export default CustomerForm;
