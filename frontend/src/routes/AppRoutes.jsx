import { Route, Routes } from 'react-router-dom';
import Customers from '../pages/Customers';
import Dashboard from '../pages/Dashboard';
import OrderDetails from '../pages/OrderDetails';
import Orders from '../pages/Orders';
import Products from '../pages/Products';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
    </Routes>
  );
}

export default AppRoutes;
