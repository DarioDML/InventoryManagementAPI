const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

class Product {
    static async findAll({ limit = 10, offset = 0, search = '', sort = 'created_at', order = 'DESC' }) {
        const db = getDb();
        const collection = db.collection('products');

        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting
        const allowedSorts = ['price', 'quantity', 'created_at', 'updated_at', 'name'];
        const sortColumn = allowedSorts.includes(sort) ? sort : 'created_at';
        const sortDirection = order.toUpperCase() === 'ASC' ? 1 : -1;
        const sortObj = { [sortColumn]: sortDirection };

        const products = await collection.find(query)
            .sort(sortObj)
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .toArray();

        const total = await collection.countDocuments(query);

        return {
            data: products,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                page: Math.floor(offset / limit) + 1
            }
        };
    }

    static async findById(id) {
        const db = getDb();
        try {
            return await db.collection('products').findOne({ _id: new ObjectId(id) });
        } catch (e) {
            return null;
        }
    }

    static async findLowStock() {
        const db = getDb();
        // Since we can't easily compare two fields in a simple find without $expr,
        // and reorder_point might be different per product.
        return await db.collection('products').find({
            $expr: { $lte: ["$quantity", "$reorder_point"] }
        }).toArray();
    }

    static async create(data) {
        const db = getDb();
        const product = {
            ...data,
            quantity: parseInt(data.quantity) || 0,
            price: parseFloat(data.price),
            reorder_point: parseInt(data.reorder_point) || 10,
            created_at: new Date(),
            updated_at: new Date()
        };
        const result = await db.collection('products').insertOne(product);
        return result.insertedId;
    }

    static async update(id, data) {
        const db = getDb();
        const updateData = {
            ...data,
            updated_at: new Date()
        };
        // Ensure numeric types
        if (updateData.quantity !== undefined) updateData.quantity = parseInt(updateData.quantity);
        if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price);
        
        try {
            const result = await db.collection('products').updateOne(
                { _id: new ObjectId(id) },
                { $set: updateData }
            );
            return result.matchedCount > 0;
        } catch (e) {
            return false;
        }
    }

    static async delete(id) {
        const db = getDb();
        try {
            const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount > 0;
        } catch (e) {
            return false;
        }
    }

    static async findBySku(sku) {
        const db = getDb();
        const product = await db.collection('products').findOne({ sku });
        // Map _id to id for compatibility with validator logic if needed
        if (product) {
            product.id = product._id.toString(); 
        }
        return product;
    }
}

module.exports = Product;
