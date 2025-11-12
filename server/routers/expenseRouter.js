const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');

const { schemaValidator } = require('../middlewares/validator'); 
const { createExpenseValidator, updateExpenseValidator } = require('../validators/expenseValidator');

router.get('/', 
                        authMiddleware, 
                        roleMiddleware(['admin', 'manager']),
                        expenseController.getAllExpenses
                    );
                    
router.get('/total', 
                        authMiddleware, 
                        roleMiddleware(['admin', 'manager']),
                        expenseController.getTotalExpenses
                    );

router.get('/:id', 
                        authMiddleware, 
                        roleMiddleware(['admin', 'manager']),
                        expenseController.getExpenseById
                    );

router.post('/', 
                            authMiddleware, 
                            roleMiddleware(['admin', 'manager']), 
                            schemaValidator(createExpenseValidator),
                            expenseController.createExpense
                        );

router.patch('/:id', 
                                authMiddleware, 
                                roleMiddleware(['admin', 'manager']), 
                                schemaValidator(createExpenseValidator),
                                expenseController.updateExpense
                            );

router.delete('/:id', 
                                authMiddleware, 
                                roleMiddleware(['admin']), 
                                expenseController.deleteExpense
                            );

module.exports = router;