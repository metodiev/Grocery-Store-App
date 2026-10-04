import { asyncHandler } from "../utils/asyncHandler.js";
import { messageResponse, successResponse } from "../utils/apiResponse.js";
import {
  addItemToCart,
  clearCart,
  getOrCreateCart,
  removeCartItem,
  updateCartItem
} from "../services/cartService.js";

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id);
  return successResponse(res, cart);
});

export const addToCart = asyncHandler(async (req, res) => {
  const cart = await addItemToCart(req.user.id, req.body.productId, req.body.quantity);
  return successResponse(res, cart, 201);
});

export const updateCartItemHandler = asyncHandler(async (req, res) => {
  const cart = await updateCartItem(req.user.id, req.params.itemId, req.body.quantity);
  return successResponse(res, cart);
});

export const removeCartItemHandler = asyncHandler(async (req, res) => {
  const cart = await removeCartItem(req.user.id, req.params.itemId);
  return successResponse(res, cart);
});

export const clearCartHandler = asyncHandler(async (req, res) => {
  await clearCart(req.user.id);
  return messageResponse(res, "Cart cleared");
});
