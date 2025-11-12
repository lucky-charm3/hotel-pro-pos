const productService = require('../services/productService');
const asyncHandler=require('../middlewares/asyncHandler');

const productController = {
  getAllProducts: asyncHandler(async (req, res) => {
      const { search='', limit = 15, offset = 0 } = req.query;
      const products = await productService.getAllProducts(search, parseInt(limit), parseInt(offset));
      res.status(200).json({ products,totalPages:Math.ceil(products.length/limit) });
  }),

  getProductById: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.status(200).json(product);
  }),

  createProduct: asyncHandler(async (req, res) => {
      const result = await productService.createProduct(req.body);
      res.status(201).json(result);
  }),

  updateProduct: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const result = await productService.updateProduct(id, req.body);
      res.status(200).json(result);
  }),

  deleteProduct: asyncHandler(async (req, res) => {
      const { id } = req.params;
      const result = await productService.deleteProduct(id);
      res.status(200).json(result);
  }),

  getTotalProducts: asyncHandler(async (req, res) => {
      const { search } = req.query;
      const total = await productService.getTotalProducts(search);
      res.status(200).json({ total_products: total });
  })
};

module.exports = productController;