const { body, param } = require('express-validator');
const Product = require('../models/product.model');
const { ObjectId } = require('mongodb');

// Helper to check for valid ObjectId
const isObjectId = (value) => {
    return ObjectId.isValid(value);
};

const productValidators = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        .matches(/^[^0-9]*$/).withMessage('Product name cannot contain numbers'),
    
    body('sku')
        .trim()
        .notEmpty().withMessage('SKU is required')
        .custom(async (value, { req }) => {
            const existingProduct = await Product.findBySku(value);
            if (existingProduct) {
                // If checking during update, allow same product
                // Req.params.id is string here
                if (req.params.id && existingProduct._id.toString() === req.params.id) {
                    return true;
                }
                throw new Error('SKU already exists');
            }
            return true;
        }),

    body('price')
        .isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),

    body('quantity')
        .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),

    body('reorder_point')
        .optional()
        .isInt({ min: 0 }).withMessage('Reorder point must be a non-negative integer'),
        
    body('supplier_id')
        .optional()
        // Removed isInt check for supplier_id as it might be ObjectId in future, allowing string for now
        .isString().withMessage('Supplier ID must be valid')
];

// Add parameter validation for ID routes
const validateId = [
    param('id').custom((value) => {
        if (!isObjectId(value)) {
            throw new Error('Invalid ID format');
        }
        return true;
    })
];

const movementValidators = [
    body('product_id')
        .custom((value) => {
            if (!isObjectId(value)) throw new Error('Invalid Product ID');
            return true;
        }),
    body('type').isIn(['IN', 'OUT', 'ADJUSTMENT']).withMessage('Type must be IN, OUT, or ADJUSTMENT'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be greater than 0'),
    body('description').optional().isString()
];

module.exports = { productValidators, movementValidators, validateId };
