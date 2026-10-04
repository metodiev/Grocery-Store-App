import { asyncHandler } from "../utils/asyncHandler.js";
import { messageResponse, successResponse } from "../utils/apiResponse.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../services/productService.js";

export const listProducts = asyncHandler(async (req, res) => {
  const products = await getProducts(req.query);
  return successResponse(res, products);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  return successResponse(res, product);
});

export const createProductHandler = asyncHandler(async (req, res) => {
  const product = await createProduct(req.body);
  return successResponse(res, product, 201);
});

export const updateProductHandler = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);
  return successResponse(res, product);
});

export const deleteProductHandler = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);
  return messageResponse(res, "Product deleted");
});
