const db = require('../config/db');

class StockMovement {
    static async findAll({ limit = 10, offset = 0, sort = 'created_at', order = 'DESC' }) {
        let query = 'SELECT sm.*, p.name as product_name, p.sku as product_sku FROM stock_movements sm JOIN products p ON sm.product_id = p.id';
        
        // Sorting validation
        const allowedSorts = ['created_at', 'quantity', 'type'];
        const sortColumn = allowedSorts.includes(sort) ? sort : 'created_at';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        query += ` ORDER BY sm.${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`;
        
        const [rows] = await db.query(query, [parseInt(limit), parseInt(offset)]);
        
        // Count
        const [countResult] = await db.query('SELECT COUNT(*) as total FROM stock_movements');

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

    // Accepts an external connection for transaction participation
    static async create(data, connection) {
        const { product_id, type, quantity, description } = data;
        // Use the provided connection (transaction) or default pool (though controller should provide it)
        const conn = connection || db; 
        
        const [result] = await conn.query(
            'INSERT INTO stock_movements (product_id, type, quantity, description) VALUES (?, ?, ?, ?)',
            [product_id, type, quantity, description || null]
        );
        return result.insertId;
    }
}

module.exports = StockMovement;
