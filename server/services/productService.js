const productRepository = require('../repositories/productRepository');
const PosError=require('../utils/posError')

const productService = {
  getAllProducts: async (search, limit, offset) => {
   const products= await productRepository.findAllProducts(search, limit, offset);
  if(products.length===0)
  {
    throw new PosError('Products not found',404)
  }
  return products;
  },

  getProductById: async (id) => {
    const product= await productRepository.findProductById(id);
    if(!product)
    {
      throw new PosError('Product not found',404)
    }
    return product;
  },

  createProduct: async (productData) => {
    const { name, price, stock, category } = productData;
    
    const existingProduct = await productRepository.findProductByBarcode(barcode);
    if (existingProduct) {
      return { success: false, message: 'Barcode already exists' };
    }

    const newProduct = await productRepository.createProduct({
      name,
      price,
      stock,
      category
    });

    return { success: true, id: newProduct._id };
  },

  updateProduct: async (id, productData) => {
    const { name, price, stock, category } = productData;
    
    const updated = await productRepository.updateProduct(id, {
      name,
      price,
      stock,
      category
    });

    if (!updated) {
      return { success: false, message: 'Product not found' };
    }

    return { success: true };
  },

  deleteProduct: async (id) => {
    const deleted = await productRepository.deleteProduct(id);
    if (!deleted) {
      return { success: false, message: 'Product not found' };
    }

    return { success: true };
  },

  getTotalProducts: async (search) => {
    return await productRepository.countProducts(search);
  }
};

module.exports = productService;