const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

class Supplier {
    static async findAll({ limit = 10, offset = 0, sort = 'created_at', order = 'DESC' }) {
        const db = getDb();
        const collection = db.collection('suppliers');
        
        const sortDirection = order.toUpperCase() === 'ASC' ? 1 : -1;
        const sortObj = { [sort]: sortDirection };

        const suppliers = await collection.find({})
            .sort(sortObj)
            .skip(parseInt(offset))
            .limit(parseInt(limit))
            .toArray();

        const total = await collection.countDocuments();

        return {
            data: suppliers,
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
            return await db.collection('suppliers').findOne({ _id: new ObjectId(id) });
        } catch (e) {
            return null;
        }
    }

    static async create(data) {
        const db = getDb();
        const supplier = {
            ...data,
            created_at: new Date(),
            updated_at: new Date()
        };
        const result = await db.collection('suppliers').insertOne(supplier);
        return result.insertedId;
    }

    static async update(id, data) {
        const db = getDb();
        const updateData = {
            ...data,
            updated_at: new Date()
        };
        try {
            const result = await db.collection('suppliers').updateOne(
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
            const result = await db.collection('suppliers').deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount > 0;
        } catch (e) {
            return false;
        }
    }

    // "Relational" lookup: Get all products for this supplier
    static async getProducts(supplierId) {
        const db = getDb();
        try {
            const query = [];
            query.push({ supplier_id: supplierId.toString() });
            
            if (ObjectId.isValid(supplierId)) {
                query.push({ supplier_id: new ObjectId(supplierId) });
            }

            return await db.collection('products').find({ $or: query }).toArray();
        } catch(e) {
            console.error(e);
            return [];
        }
    }
}

module.exports = Supplier;
