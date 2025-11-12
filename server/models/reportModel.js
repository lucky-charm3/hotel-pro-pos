
const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['sales', 'products', 'expenses', 'banking'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  filters: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


reportSchema.pre('save', function(next) {
  if (!this.title) {
    const typeMap = {
      sales: 'Sales Report',
      products: 'Products Report',
      expenses: 'Expenses Report',
      banking: 'Banking Report',
      comprehensive: 'Comprehensive Report'
    };
    
    this.title = `${typeMap[this.type]} - ${this.startDate.toDateString()} to ${this.endDate.toDateString()}`;
  }
  next();
});


reportSchema.index({ generatedBy: 1, createdAt: -1 });
reportSchema.index({ type: 1, createdAt: -1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);