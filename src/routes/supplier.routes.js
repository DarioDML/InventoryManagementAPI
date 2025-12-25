const express = require('express');
const router = express.Router();
const SupplierController = require('../controllers/supplier.controller');
const { supplierValidators, validateId } = require('../middlewares/validators');
const { validate } = require('../middlewares/validation.middleware');

router.get('/', SupplierController.getAll);
router.post('/', supplierValidators, validate, SupplierController.create);

router.get('/:id', validateId, SupplierController.getOne);
router.put('/:id', validateId, supplierValidators, validate, SupplierController.update);
router.delete('/:id', validateId, SupplierController.delete);

router.get('/:id/products', validateId, SupplierController.getProducts);

module.exports = router;
