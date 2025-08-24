import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc   Fetch All Products
// @route  GET /api/products
// @access PUBLIC
const getProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc   Fetch a Product
// @route  GET /api/products/:id
// @access PUBLIC
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req?.params?.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Resource nor found." });
  }
});

export { getProducts, getProductById };
