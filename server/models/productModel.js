const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  barcode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    enum: ['food', 'drinks', 'services', 'others'],
    required: true,
    default: 'others'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

productSchema.index({ barcode: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1 });

productSchema.pre('save',function(next){
const suffix=Math.random().toString(36).substring(2,8).toUpperCase();
this.barcode=`PRD-${Date.now()}-${suffix}`;
next();
})

productSchema.statics.findByCategory = function(category) {
  return this.find({ category, isActive: true });
};

productSchema.statics.findLowStock = function(threshold = 5) {
  return this.find({ stock: { $lte: threshold }, isActive: true });
};

productSchema.methods.updateStock = function(quantity) {
  this.stock += quantity;
  if (this.stock < 0) this.stock = 0;
  return this.save();
};

module.exports = mongoose.model('Product', productSchema);