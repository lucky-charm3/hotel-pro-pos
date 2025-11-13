const express = require('express');
const mongoose=require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dbConnect=require('./config/db')
require('dotenv').config();

const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');
const { 
  generalLimiter, 
  authLimiter,
  salesLimiter,
  reportLimiter 
} = require('./middlewares/rateLimiter');

const app = express();

const PORT=process.env.PORT;

app.use(helmet());
app.use(compression());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use(logger);

app.use('/api/auth', authLimiter);
app.use('/api/sales', salesLimiter);
app.use('/api/reports', reportLimiter);
app.use('/api', generalLimiter);

app.use('/api', require('./routers'));

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'POS System API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.use(errorHandler);

process.on('SIGINT', async () => {
  console.log('\n Shutting down gracefully...');
  await mongoose.connection.close();
  console.log(' MongoDB connection closed.');
  process.exit(0);
});

dbConnect();

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
})



process.on('unhandledRejection', (err, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;