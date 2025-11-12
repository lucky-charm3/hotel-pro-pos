const express = require('express');
const router = express.Router();
const saleController = require('../controllers/saleController');
const { schemaValidator } = require('../middlewares/validator');
const { createSaleValidator, updateSaleValidator } = require('../validators/saleValidator');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

router.get('/:id',
                         authMiddleware, 
                         saleController.getSaleById
                        );

router.get('/:id/details',
                             authMiddleware, 
                             saleController.getSaleDetails
                            );

router.get('/cashier/sales', 
                            authMiddleware, 
                            roleMiddleware(['cashier']), 
                            saleController.getCashierSales
                        );

router.get('/cashier/today-total', 
                           authMiddleware, 
                           roleMiddleware(['cashier']), 
                           saleController.getTotalSalesToday
                        );

router.get('/', 
                        authMiddleware, 
                        roleMiddleware(['admin', 'manager']), 
                        saleController.getAllSales
                    );

router.post('/', 
                            authMiddleware, 
                            roleMiddleware(['admin', 'cashier']),
                            schemaValidator(createSaleValidator),
                            saleController.createSale
                        );

router.delete('/:id', 
                                authMiddleware, 
                                roleMiddleware(['admin']), 
                                saleController.deleteSale
                            );

module.exports = router;