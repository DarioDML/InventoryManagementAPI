const Supplier = require('../models/supplier.model');

class SupplierController {
    static async getAll(req, res, next) {
        try {
            const { limit, offset, sort, order } = req.query;
            const result = await Supplier.findAll({ limit, offset, sort, order });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    static async getOne(req, res, next) {
        try {
            const supplier = await Supplier.findById(req.params.id);
            if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
            res.json(supplier);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const id = await Supplier.create(req.body);
            res.status(201).json({ message: 'Supplier created', id });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const success = await Supplier.update(req.params.id, req.body);
            if (!success) return res.status(404).json({ message: 'Supplier not found' });
            res.json({ message: 'Supplier updated' });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const success = await Supplier.delete(req.params.id);
            if (!success) return res.status(404).json({ message: 'Supplier not found' });
            res.json({ message: 'Supplier deleted' });
        } catch (error) {
            next(error);
        }
    }

    static async getProducts(req, res, next) {
        try {
            const products = await Supplier.getProducts(req.params.id);
            res.json(products);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = SupplierController;
