const express = require('express');
const router = express.Router();
const StockMovementController = require('../controllers/stockMovement.controller');
const { validate } = require('../middlewares/validation.middleware');
const { body } = require('express-validator');

const movementValidators = [
    body('product_id').isInt().withMessage('Product ID must be an integer'),
    body('type').isIn(['IN', 'OUT', 'ADJUSTMENT']).withMessage('Type must be IN, OUT, or ADJUSTMENT'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be greater than 0'),
    body('description').optional().isString()
];

router.get('/', StockMovementController.getAll);
router.post('/', movementValidators, validate, StockMovementController.create);

module.exports = router;
