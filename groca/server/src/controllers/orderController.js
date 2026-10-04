import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import { createOrder, getOrderById, getOrders, updateOrderStatus } from "../services/orderService.js";

export const createOrderHandler = asyncHandler(async (req, res) => {
  const order = await createOrder(req.user.id, req.body);
  return successResponse(res, order, 201);
});

export const getOrdersHandler = asyncHandler(async (req, res) => {
  const orders = await getOrders(req.user.id, req.user.role);
  return successResponse(res, orders);
});

export const getOrderByIdHandler = asyncHandler(async (req, res) => {
  const order = await getOrderById(req.params.id, req.user.id, req.user.role);
  return successResponse(res, order);
});

export const updateOrderStatusHandler = asyncHandler(async (req, res) => {
  const order = await updateOrderStatus(req.params.id, req.body.status);
  return successResponse(res, order);
});
