const Sale = require('../models/saleModel');

const saleRepository = {
  findAllSales: async (search, startDate, endDate, limit = 10, offset = 0) => {
    let query = { status: 'completed' };
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (search) {
      query.$or = [
        { 'cashier.username': { $regex: search, $options: 'i' } },
        { 'items.productName': { $regex: search, $options: 'i' } },
        { paymentMethod: { $regex: search, $options: 'i' } }
      ];
    }

    return await Sale.find(query)
      .populate('cashier', 'username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
  },

  findSalesByUser: async (userId, search, startDate, endDate, limit = 10, offset = 0) => {
    let query = { cashier: userId, status: 'completed' };
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (search) {
      query.$or = [
        { 'items.productName': { $regex: search, $options: 'i' } },
        { paymentMethod: { $regex: search, $options: 'i' } }
      ];
    }

    return await Sale.find(query)
      .populate('cashier', 'username')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
  },

  findSaleById: async (id) => {
    return await Sale.findById(id)
      .populate('cashier', 'username email phone')
      .populate('items.product', 'name barcode price');
  },

  findSaleDetails: async (id) => {
    const sale = await Sale.findById(id)
      .populate('cashier', 'username')
      .populate('items.product', 'name price');
    
    if (!sale) return null;

    return {
      id: sale._id,
      total_price: sale.totalPrice,
      payment_method: sale.paymentMethod,
      created_at: sale.createdAt,
      cashier: sale.cashier.username,
      items: sale.items.map(item => ({
        product_name: item.productName,
        price: item.price,
        quantity: item.quantity,
        item_total: item.subtotal
      }))
    };
  },

  createSale: async (saleData) => {
    const sale = new Sale(saleData);
    return await sale.save();
  },

  deleteSale: async (id) => {
    return await Sale.findByIdAndUpdate(
      id, 
      { status: 'cancelled' }, 
      { new: true }
    );
  },

getTotalSalesAmount: async (userId = null, startDate = null, endDate = null) => {
  let matchQuery = {};
  
  if (userId) {
    matchQuery.userId = userId;
  }

  if (startDate && endDate) {
    matchQuery.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate + 'T23:59:59.999Z')
    };
  }

  const result = await Sale.aggregate([
    { $match: matchQuery },
    { 
      $group: { 
        _id: null, 
        total: { $sum: '$totalAmount' },
        count: { $sum: 1 }
      } 
    }
  ]);

  return result.length > 0 ? result[0].total : 0;
},

  countSales: async (search, startDate, endDate, userId = null) => {
    let query = { status: 'completed' };
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (userId) {
      query.cashier = userId;
    }

    if (search) {
      query.$or = [
        { 'cashier.username': { $regex: search, $options: 'i' } },
        { 'items.productName': { $regex: search, $options: 'i' } },
        { paymentMethod: { $regex: search, $options: 'i' } }
      ];
    }

    return await Sale.countDocuments(query);
  }
};

module.exports = saleRepository;