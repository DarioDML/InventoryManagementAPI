const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

class StockMovement {
    static async findAll({ limit = 10, offset = 0, sort = 'created_at', order = 'DESC' }) {
        const db = getDb();
        
        const sortDirection = order.toUpperCase() === 'ASC' ? 1 : -1;
        // Map common sort keys if needed
        const sortObj = { [sort]: sortDirection };

        // We need to look up product details (aggregate)
        const pipeline = [
            { $sort: sortObj },
            { $skip: parseInt(offset) },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: 'products',
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' }, 
            {
                $project: {
                    _id: 1,
                    type: 1,
                    quantity: 1,
                    description: 1,
                    created_at: 1,
                    product_id: 1,
                    product_name: '$product.name',
                    product_sku: '$product.sku'
                }
            }
        ];

        const data = await db.collection('stock_movements').aggregate(pipeline).toArray();
        const total = await db.collection('stock_movements').countDocuments();

        return {
            data,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                page: Math.floor(offset / limit) + 1
            }
        };
    }

    // Pass 'session' for transaction support
    static async create(data, session) {
        const db = getDb();
        const movement = {
            product_id: new ObjectId(data.product_id), // Ensure it's ObjectId
            type: data.type,
            quantity: parseInt(data.quantity),
            description: data.description,
            created_at: new Date()
        };
        
        // Options with session
        const options = session ? { session } : {};
        
        const result = await db.collection('stock_movements').insertOne(movement, options);
        return result.insertedId;
    }
}

module.exports = StockMovement;
