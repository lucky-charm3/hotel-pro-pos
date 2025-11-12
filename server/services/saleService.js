const saleRepository = require('../repositories/saleRepository');
const productRepository = require('../repositories/productRepository');
const PosError=require('../utils/posError')

const saleService = {
  getAllSales: async (search, startDate, endDate, limit, offset) => {
    const sales= await saleRepository.findAllSales(search, startDate, endDate, limit, offset);
    if(sales.length===0)
  {
    throw new PosError('Sales not found',404);
  }
  return sales;
  },

  getCashierSales: async (userId, search, startDate, endDate, limit, offset) => {
    const sales= await saleRepository.findSalesByUser(userId, search, startDate, endDate, limit, offset);
   if(sales.length===0)
   {
    throw new PosError('Sales not found',404)
   }
    return sales;
  },

  getSaleById: async (id) => {
    const sale= await saleRepository.findSaleById(id);
    if(!sale)
    {
      throw new PosError('Sale not found',404)
    }
    return sale;
  },

  getSaleDetails: async (id) => {
    return await saleRepository.findSaleDetails(id);
  },

  createSale: async (userId, items, paymentMethod, totalPrice) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return { success: false, message: 'No items provided for the sale.' };
    }

    for (let item of items) {
      const product = await productRepository.findProductById(item.product);
      if (!product) {
        return { success: false, message: `Product not found: ${item.product}` };
      }
      if (product.stock < item.quantity) {
        return { 
          success: false, 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        };
      }
    }

    const saleData = {
      cashier: userId,
      items: items.map(item => ({
        product: item.product,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      })),
      totalPrice,
      paymentMethod,
      status: 'completed'
    };

    const newSale = await saleRepository.createSale(saleData);
    
    for (let item of items) {
      await productRepository.updateProductStock(item.product, -item.quantity);
    }

    return { 
      success: true, 
      id: newSale._id, 
      total_price: newSale.totalPrice 
    };
  },

  deleteSale: async (id) => {
    const sale = await saleRepository.findSaleById(id);
    if (!sale) {
      return { success: false, message: 'Sale not found' };
    }

    if (sale.status === 'completed') {
      for (let item of sale.items) {
        await productRepository.updateProductStock(item.product, item.quantity);
      }
    }

    const deleted = await saleRepository.deleteSale(id);
    if (!deleted) {
      return { success: false, message: 'Failed to delete sale' };
    }

    return { success: true };
  },

  getTotalSalesAmount: async (startDate, endDate, userId = null) => {
    return await saleRepository.getTotalSalesAmount(startDate, endDate, userId);
  },

  getTotalSalesCount: async (search, startDate, endDate, userId = null) => {
    return await saleRepository.countSales(search, startDate, endDate, userId);
  }
};

module.exports = saleService;