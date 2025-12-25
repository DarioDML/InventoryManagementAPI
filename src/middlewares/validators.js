const { body } = require('express-validator');
const Product = require('../models/product.model');

const productValidators = [
    body('name')
        .trim()
        .notEmpty().withMessage('Product name is required')
        // Requirement: "Een voornaam kan geen cijfers bevatten" - applied to Product Name as per user request
        .matches(/^[^0-9]*$/).withMessage('Product name cannot contain numbers'),
    
    body('sku')
        .trim()
        .notEmpty().withMessage('SKU is required')
        .custom(async (value, { req }) => {
            // Check if SKU exists and it's not the same product we are updating
            const existingProduct = await Product.findBySku(value);
            if (existingProduct) {
                // If updating (req.params.id exists), allow if it's the same product
                if (req.params.id && existingProduct.id === parseInt(req.params.id)) {
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
        .isInt().withMessage('Supplier ID must be an integer')
];

module.exports = { productValidators };
