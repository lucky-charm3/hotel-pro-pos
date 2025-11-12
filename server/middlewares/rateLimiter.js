const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, 
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  },
  standardHeaders: true, 
  legacyHeaders: false,
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  message: {
    success: false,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.'
  },
  skipSuccessfulRequests: true, 
});


const salesLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 30, 
  message: {
    success: false,
    message: 'Too many sales requests, please slow down.'
  }
});


const reportLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 10, 
  message: {
    success: false,
    message: 'Too many report generation requests, please try again after 5 minutes.'
  }
});


const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 500, 
  message: {
    success: false,
    message: 'Too many admin requests from this IP.'
  }
});


const dynamicLimiter = (req, res, next) => {
  let limiter;
  
  switch (req.user?.role) {
    case 'admin':
      limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 2000, 
        message: {
          success: false,
          message: 'Rate limit exceeded for admin account.'
        }
      });
      break;
    case 'manager':
      limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000, 
        message: {
          success: false,
          message: 'Rate limit exceeded for manager account.'
        }
      });
      break;
    case 'cashier':
      limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 500, 
        message: {
          success: false,
          message: 'Rate limit exceeded for cashier account.'
        }
      });
      break;
    default:
      limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100, 
        message: {
          success: false,
          message: 'Rate limit exceeded. Please login for higher limits.'
        }
      });
  }
  
  limiter(req, res, next);
};

module.exports = {
  generalLimiter,
  authLimiter,
  salesLimiter,
  reportLimiter,
  adminLimiter,
  dynamicLimiter
};