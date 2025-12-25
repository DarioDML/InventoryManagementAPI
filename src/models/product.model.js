const db = require('../config/db');

class Product {
    static async findAll({ limit = 10, offset = 0, search = '', sort = 'created_at', order = 'DESC' }) {
        let query = 'SELECT * FROM products';
        const params = [];
        const whereClauses = [];

        if (search) {
            whereClauses.push('(name LIKE ? OR sku LIKE ?)');
            params.push(`%${search}%`, `%${search}%`);
        }

        if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }

        // Validate sort column to prevent SQL injection
        const allowedSorts = ['price', 'quantity', 'created_at', 'updated_at', 'name'];
        const sortColumn = allowedSorts.includes(sort) ? sort : 'created_at';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        query += ` ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await db.query(query, params);
        
        // Get total count for pagination metadata
        let countQuery = 'SELECT COUNT(*) as total FROM products';
        const countParams = [];
        if (whereClauses.length > 0) {
            countQuery += ' WHERE ' + whereClauses.join(' AND ');
            countParams.push(...params.slice(0, params.length - 2)); // Exclude limit/offset
        }
        const [countResult] = await db.query(countQuery, countParams);
        
        return {
            data: rows,
            pagination: {
                total: countResult[0].total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                page: Math.floor(offset / limit) + 1
            }
        };
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    static async create(data) {
        const { name, sku, price, quantity, reorder_point, supplier_id } = data;
        const [result] = await db.query(
            'INSERT INTO products (name, sku, price, quantity, reorder_point, supplier_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, sku, price, quantity, reorder_point || 10, supplier_id || null]
        );
        return result.insertId;
    }

    static async update(id, data) {
        const { name, sku, price, quantity, reorder_point, supplier_id } = data;
        const [result] = await db.query(
            'UPDATE products SET name = ?, sku = ?, price = ?, quantity = ?, reorder_point = ?, supplier_id = ? WHERE id = ?',
            [name, sku, price, quantity, reorder_point, supplier_id, id]
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
    
    // Check for SKU uniqueness
    static async findBySku(sku) {
        const [rows] = await db.query('SELECT id FROM products WHERE sku = ?', [sku]);
        return rows[0];
    }
}

module.exports = Product;
