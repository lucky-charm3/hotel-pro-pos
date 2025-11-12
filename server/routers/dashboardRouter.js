const express = require('express');
const getDashboardSummary = require('../controllers/dashboardController');
const {authMiddleware}=require('../middlewares/authMiddleware')

const dashboardRouter = express.Router();

dashboardRouter.get('/summary',authMiddleware, getDashboardSummary);

module.exports = dashboardRouter;

