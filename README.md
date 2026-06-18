# Inventory Management System

A full-stack Inventory & Order Management System built with React, FastAPI, PostgreSQL, and Docker.

## Features

* Product Management

  * Create, view, update, and delete products
  * Track inventory quantities
  * Low stock monitoring

* Customer Management

  * Create and manage customer records

* Order Management

  * Create customer orders
  * Inventory updates after order creation

* Dashboard

  * Total Products
  * Total Customers
  * Total Orders
  * Low Stock Products

## Tech Stack

### Frontend

* React
* Vite
* Axios
* React Router

### Backend

* FastAPI
* SQLAlchemy
* Pydantic

### Database

* PostgreSQL (Neon)

### DevOps

* Docker
* Docker Compose
* Render (Backend Deployment)
* Vercel (Frontend Deployment)

---

## Live Demo

### Frontend

YOUR_VERCEL_URL

### Backend API

https://inventory-management-system-7gbg.onrender.com

### Swagger Documentation

https://inventory-management-system-7gbg.onrender.com/docs

---

## Project Structure

inventory-management-system/
├── frontend/
│   ├── src/
│   └── public/
├── backend/
│   ├── app/
│   ├── routers/
│   ├── models/
│   └── schemas/
├── docker-compose.yml
└── README.md

---

## Local Setup

### Clone Repository

```bash
git clone https://github.com/AkashSingh0/inventory-management-system.git
cd inventory-management-system
```

### Start Application

```bash
docker-compose up --build
```

### Frontend

```bash
http://localhost:3000
```

### Backend

```bash
http://localhost:8000
```

### API Documentation

```bash
http://localhost:8000/docs
```

---

## API Endpoints

### Dashboard

* GET /dashboard

### Products

* GET /products
* GET /products/{id}
* POST /products
* PUT /products/{id}
* DELETE /products/{id}

### Customers

* GET /customers
* GET /customers/{id}
* POST /customers
* DELETE /customers/{id}

### Orders

* GET /orders
* GET /orders/{id}
* POST /orders
* DELETE /orders/{id}

---

## Author

Akash Singh
