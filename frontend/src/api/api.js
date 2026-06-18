import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error('Network error. Please check your connection and try again.'),
      );
    }
    return Promise.reject(error);
  },
);

export function getErrorMessage(error) {
  if (typeof error === 'string') return error;
  if (error?.message && !error?.response) return error.message;

  const { data, status } = error.response ?? {};

  if (data?.detail) {
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) {
      return data.detail
        .map((item) => item.msg || item.message || JSON.stringify(item))
        .join(', ');
    }
  }

  if (status === 404) return 'Resource not found.';
  if (status === 400) return 'Invalid request. Please check your input.';
  if (status >= 500) return 'Server error. Please try again later.';

  return error.message || 'An unexpected error occurred.';
}

// Dashboard
export const getDashboard = () => api.get('/dashboard/');

// Products
export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Customers
export const getCustomers = () => api.get('/customers');
export const getCustomer = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post('/customers', data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

// Orders
export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const createOrder = (data) => api.post('/orders', data);
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

export default api;
