const express = require('express');
const router = express.Router();

const userRoutes = require('./userRouter');
const productRoutes = require('./productRouter');
const saleRoutes = require('./saleRouter');
const expenseRoutes = require('./expenseRouter');
const bankingRoutes = require('./bankingRouter');
const reportRoutes = require('./reportRouter');
const dashboardRoutes=require('./dashboardRouter');

router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/sales', saleRoutes);
router.use('/expenses', expenseRoutes);
router.use('/banking', bankingRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;