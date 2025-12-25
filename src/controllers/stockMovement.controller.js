const StockMovement = require('../models/stockMovement.model');
const { getClient, getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

class StockMovementController {
    static async getAll(req, res, next) {
        try {
            const { limit, offset, sort, order } = req.query;
            const result = await StockMovement.findAll({ limit, offset, sort, order });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        const client = getClient();
        const session = client.startSession();

        try {
            await session.withTransaction(async () => {
                const db = getDb(); // Gets the db instance
                const { product_id, type, quantity, description } = req.body;
                
                const productIdObj = new ObjectId(product_id);

                // 1. Get Product
                const product = await db.collection('products').findOne(
                    { _id: productIdObj }, 
                    { session }
                );
                
                if (!product) {
                    // Abort manually if needed, but throwing error aborts transaction
                    throw new Error('Product not found');
                }

                // 2. Validate Stock
                if (type === 'OUT' && product.quantity < quantity) {
                    const error = new Error('Insufficient stock');
                    error.statusCode = 400;
                    throw error;
                }

                // 3. Create Movement
                await StockMovement.create(req.body, session);

                // 4. Update Product
                let newQuantity = product.quantity;
                if (type === 'IN' || type === 'ADJUSTMENT') {
                    newQuantity += parseInt(quantity);
                } else if (type === 'OUT') {
                    newQuantity -= parseInt(quantity);
                }

                await db.collection('products').updateOne(
                    { _id: productIdObj },
                    { $set: { quantity: newQuantity, updated_at: new Date() } },
                    { session }
                );
            });

            // If we get here, transaction committed
            res.status(201).json({ message: 'Stock movement recorded successfully' });

        } catch (error) {
            // handle custom errors
            if (error.message === 'Product not found') return res.status(404).json({ message: 'Product not found' });
            if (error.message === 'Insufficient stock') return res.status(400).json({ message: 'Insufficient stock' });
            
            next(error);
        } finally {
            await session.endSession();
        }
    }
}

module.exports = StockMovementController;
