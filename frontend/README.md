# Inventory Management System — Frontend

React frontend for the Inventory Management System API.

## Tech Stack

- React (JavaScript)
- Vite
- React Router DOM
- Axios
- Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+
- Backend API running at `http://localhost:8000`

### Installation

```bash
npm install
```

### Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Default configuration:

```
VITE_API_URL=http://localhost:8000
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── api/
│   └── api.js
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── ProductForm.jsx
│   ├── CustomerForm.jsx
│   └── OrderForm.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Customers.jsx
│   ├── Orders.jsx
│   └── OrderDetails.jsx
├── routes/
│   └── AppRoutes.jsx
├── App.jsx
└── main.jsx
```

## Features

- **Dashboard** — Total products, customers, orders, and low stock alerts
- **Products** — Full CRUD with validation and modal forms
- **Customers** — Create and delete with email validation
- **Orders** — Multi-product order creation, details view, inventory error handling
