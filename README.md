# Inventory Management API

A database-driven REST API for managing inventory, products, and stock movements. Built with Node.js, Express, and MySQL.

## Features

- **Products CRUD**: Manage products with validation.
- **Stock Movements**: Track stock changes (IN/OUT/ADJUSTMENT) and automatically update product quantities.
- **Search & Filtering**: Search by name, SKU, warehouse.
- **Sorting & Pagination**: Sort results and paginate.
- **Advanced Validation**: Input validation for data integrity.

## Prerequisites

- Node.js (v20+)
- MongoDB (Atlas or Local)
- Git

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd InventoryManagementAPI
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    - Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    - Update `.env` with your `MONGO_URI`.

4.  **Database Setup:**
    - No manual schema creation needed usually with MongoDB, but collections will be created automatically.
    - Ensure your MongoDB Connection String is valid in `.env`.

5.  **Run the server:**
    - Development mode:
      ```bash
      npm run dev
      ```
    - Production mode:
      ```bash
      npm start
      ```

## API Documentation

Visit `http://localhost:3000/` in your browser to view the API documentation.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (via `mongodb` native driver)
- **Validation**: express-validator

## License

ISC
