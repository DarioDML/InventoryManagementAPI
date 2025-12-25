const express = require('express');
const router = express.Router();
const StockMovementController = require('../controllers/stockMovement.controller');
const { validate } = require('../middlewares/validation.middleware');
const { movementValidators } = require('../middlewares/validators');

router.get('/', StockMovementController.getAll);
router.post('/', movementValidators, validate, StockMovementController.create);

module.exports = router;
