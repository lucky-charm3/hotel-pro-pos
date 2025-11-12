const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
    'utilities',
    'rent',
    'maintenance',
    'transportation',
    'security',
    'inventory',
    'supplies',
    'salaries',
    'advertising',
    'software',
    'bank_charges',
    'loan_interest',
    'miscellaneous'
  ],
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

expenseSchema.index({ createdAt: 1 });
expenseSchema.index({ recordedBy: 1, createdAt: 1 });
expenseSchema.index({ recordedBy: 1, createdAt: -1 });
expenseSchema.index({ category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);