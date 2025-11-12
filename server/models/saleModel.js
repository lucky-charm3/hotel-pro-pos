const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const saleSchema = new mongoose.Schema({
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [saleItemSchema],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'mobile', 'transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['completed', 'refunded', 'cancelled'],
    default: 'completed'
  }
}, {
  timestamps: true
});

saleSchema.pre('save', function(next) {
  this.items.forEach(item => {
    item.subtotal = item.price * item.quantity;
  });
  

  this.totalPrice = this.items.reduce((total, item) => total + item.subtotal, 0);
  next();
});

saleSchema.index({ createdAt: 1 });
saleSchema.index({ userId: 1, createdAt: 1 });
saleSchema.index({ cashier: 1, createdAt: -1 });
saleSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Sale', saleSchema);