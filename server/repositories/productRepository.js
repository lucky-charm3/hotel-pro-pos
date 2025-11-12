const Product = require('../models/productModel');

const productRepository = {
  findAllProducts: async (search, limit = 15, offset = 0) => {
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }

    return await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
  },

  findProductById: async (id) => {
    return await Product.findById(id);
  },

  findProductByBarcode: async (barcode) => {
    return await Product.findOne({ barcode, isActive: true });
  },

  createProduct: async (productData) => {
    const product = new Product(productData);
    return await product.save();
  },

  updateProduct: async (id, updateData) => {
    return await Product.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );
  },

  updateProductStock: async (productId, quantity) => {
    return await Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: quantity } },
      { new: true, runValidators: true }
    );
  },

  deleteProduct: async (id) => {
    return await Product.findByIdAndUpdate(
      id, 
      { isActive: false }, 
      { new: true }
    );
  },

  countProducts: async (search) => {
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }

    return await Product.countDocuments(query);
  }
};

module.exports = productRepository;