const Product = require('../models/product.model');

class ProductController {
    static async getLowStock(req, res, next) {
        try {
            const products = await Product.findLowStock();
            res.json(products);
        } catch (error) {
            next(error);
        }
    }

    static async getAll(req, res, next) {
        try {
            const { limit, offset, search, sort, order } = req.query;
            const result = await Product.findAll({ 
                limit, 
                offset, 
                search,
                sort, 
                order 
            });
            res.json(result);
        } catch (error) {
            next(error);
        }
    }

    static async getOne(req, res, next) {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    static async create(req, res, next) {
        try {
            const newProductId = await Product.create(req.body);
            res.status(201).json({ 
                message: 'Product created successfully', 
                id: newProductId 
            });
        } catch (error) {
            next(error);
        }
    }

    static async update(req, res, next) {
        try {
            const success = await Product.update(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({ message: 'Product not found or no changes made' });
            }
            res.json({ message: 'Product updated successfully' });
        } catch (error) {
            next(error);
        }
    }

    static async delete(req, res, next) {
        try {
            const success = await Product.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;
