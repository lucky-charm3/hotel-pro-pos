const Banking = require('../models/bankingModel');

const bankingRepository = {
  findAllBanking: async (search, limit = 10, offset = 0) => {
    let query = {};
    
    if (search) {
      query.$or = [
        { type: { $regex: search, $options: 'i' } },
        { 'performedBy.username': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } }
      ];
    }

    return await Banking.find(query)
      .populate('performedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
  },

  findBankingById: async (id) => {
    return await Banking.findById(id)
      .populate('performedBy', 'username email phone');
  },

  createBanking: async (bankingData) => {
    const banking = new Banking(bankingData);
    return await banking.save();
  },

  updateBanking: async (id, updateData) => {
    return await Banking.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
  },

  deleteBanking: async (id) => {
    return await Banking.findByIdAndDelete(id);
  },

  countBanking: async (search = null) => {
    let query = {};
    
    if (search) {
      query.$or = [
        { type: { $regex: search, $options: 'i' } },
        { 'performedBy.username': { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { reference: { $regex: search, $options: 'i' } }
      ];
    }

    return await Banking.countDocuments(query);
  },

 getBankingSummary: async (startDate = null, endDate = null) => {
  const matchStage = {};
  
  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate + 'T23:59:59.999Z') 
    };
  }

  const result = await Banking.aggregate([
    { $match: matchStage },
    {
      $facet: {
        summaryByType: [
          {
            $group: {
              _id: '$type',
              totalAmount: { $sum: '$amount' },
              count: { $sum: 1 },
              transactions: {
                $push: {
                  id: '$_id',
                  amount: '$amount',
                  date: '$createdAt',
                  description: '$description'
                }
              }
            }
          }
        ],
        dailyWithdrawals: [
          { $match: { type: 'withdrawal' } },
          {
            $group: {
              _id: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
              },
              amount: { $sum: '$amount' }
            }
          },
          { $sort: { _id: -1 } }
        ]
      }
    }
  ]);

  const summary = result[0].summaryByType || [];
  const dailyWithdrawals = result[0].dailyWithdrawals || [];

  let depositTotal = 0;
  let withdrawalTotal = 0;
  let transferTotal = 0;

  summary.forEach(item => {
    if (item._id === 'deposit') depositTotal = item.totalAmount;
    if (item._id === 'withdrawal') withdrawalTotal = item.totalAmount;
    if (item._id === 'transfer') transferTotal = item.totalAmount;
  });

  const netAmount = depositTotal - withdrawalTotal - transferTotal;

  return {
    summary,
    dailyWithdrawals,
    totals: {
      deposits: depositTotal,
      withdrawals: withdrawalTotal,
      transfers: transferTotal,
      net: netAmount
    }
  };
}
};

module.exports = bankingRepository;