const express = require('express');
const router = express.Router();
const bankingController = require('../controllers/bankingController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const { schemaValidator } = require('../middlewares/validator'); 
const { createBankingValidator, updateBankingValidator } = require('../validators/bankingValidator');

router.get('/', 
                        authMiddleware, 
                        roleMiddleware(['admin', 'manager']),
                        bankingController.getAllBanking
                    );

router.get('/summary', 
                        authMiddleware,
                        roleMiddleware(['admin', 'manager']),
                        bankingController.getBankingSummary
                    );

router.get('/:id', 
                        authMiddleware, 
                        roleMiddleware(['admin', 'manager']),
                        bankingController.getBankingById
                    );

router.post('/', 
                            authMiddleware, 
                            roleMiddleware(['admin', 'manager']),
                            schemaValidator(createBankingValidator), 
                            bankingController.createBanking
                        );

router.patch('/:id', 
                        authMiddleware, 
                        roleMiddleware(['admin', 'manager']), 
                        schemaValidator(updateBankingValidator),
                        bankingController.updateBanking
                    );

router.delete('/:id', 
                                authMiddleware, 
                                roleMiddleware(['admin']), 
                                bankingController.deleteBanking
                            );

module.exports = router;