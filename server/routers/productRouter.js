const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const { schemaValidator } = require('../middlewares/validator'); 
const { createProductValidator, updateProductValidator } = require('../validators/productValidator');

router.get('/', productController.getAllProducts);

router.get('/total', productController.getTotalProducts);

router.get('/:id', productController.getProductById);

router.post('/', 
                            authMiddleware, 
                            roleMiddleware(['admin', 'manager']), 
                            schemaValidator(createProductValidator),
                            productController.createProduct
                        );

router.patch('/:id', 
                        authMiddleware, 
                        roleMiddleware(['admin', 'manager']), 
                        schemaValidator(updateProductValidator),
                        productController.updateProduct
                    );

router.delete('/:id', 
                                authMiddleware, 
                                roleMiddleware(['admin']), 
                                productController.deleteProduct
                            );

module.exports = router;