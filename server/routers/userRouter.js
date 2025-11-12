const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const {schemaValidator}=require('../middlewares/validator')
const {createUserValidator,updateUserValidator}=require('../validators/userValidator');

router.get('/me', 
                        authMiddleware, 
                        userController.getMe
                    );

 router.post('/login',
                        userController.login
 )

router.patch('/profile',
                                 authMiddleware,
                                  userController.updateProfile
                                );

router.patch('/change-password', 
                                authMiddleware, 
                                userController.changePassword
                            );

router.patch('/lock-account', 
                                authMiddleware, 
                                userController.lockAccount
                            );

router.get('/', 
                        authMiddleware, 
                        roleMiddleware(['admin', 'manager']),
                         userController.getAllUsers
                        );

router.get('/cashiers', 
                            authMiddleware, 
                            roleMiddleware(['admin', 'manager']), 
                            userController.getCashiers
                        );

router.get('/:id',
                         authMiddleware, 
                         roleMiddleware(['admin', 'manager']), 
                         userController.getUserById
                        );

router.post('/',
                            authMiddleware, 
                            roleMiddleware(['admin', 'manager']),
                            schemaValidator(createUserValidator), 
                            userController.createUser
                        );

router.patch('/:id', 
                                authMiddleware, 
                                roleMiddleware(['admin', 'manager']), 
                                schemaValidator(updateUserValidator),
                                userController.updateUser
                            );

router.delete('/:id', 
                                authMiddleware, 
                                roleMiddleware(['admin']), 
                                userController.deleteUser
                            );

module.exports = router;