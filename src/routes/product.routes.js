const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { productValidators } = require('../middlewares/validators');
const { validate } = require('../middlewares/validation.middleware');

router.get('/', ProductController.getAll);
router.get('/low-stock', ProductController.getLowStock);
router.get('/:id', ProductController.getOne);
router.post('/', productValidators, validate, ProductController.create);
router.put('/:id', productValidators, validate, ProductController.update);
router.delete('/:id', ProductController.delete);

module.exports = router;
