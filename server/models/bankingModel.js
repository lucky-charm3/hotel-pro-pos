const mongoose = require('mongoose');

const bankingSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['withdrawal', 'transfer', 'deposit'],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  reference: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

bankingSchema.index({ performedBy: 1, createdAt: -1 });
bankingSchema.index({ type: 1, createdAt: -1 });
bankingSchema.index({ createdAt: -1 });

bankingSchema.virtual('formattedAmount').get(function() {
  if (this.type === 'deposit') {
    return `+${this.amount.toFixed(2)}`;
  } else {
    return `-${this.amount.toFixed(2)}`;
  }
});

bankingSchema.set('toJSON', { virtuals: true });

bankingSchema.pre('save',function(next){
  const random=Math.random().toString(36).substring(2,7).toUpperCase();
  const date=new Date().toISOString().split('T')[0].replace(/-/g, '');
  let prefix='';

  if(this.type==='withdrawal')
  {
    prefix='WD';
  }
  else if(this.type==='transfer')
  {
    prefix='TF';
  }
  else if(this.type==='deposit')
  {
    prefix='DP';
  }
  this.reference=`${prefix}-${date}-${random}`;
  next();
})

module.exports = mongoose.model('Banking', bankingSchema);