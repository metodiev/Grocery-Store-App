import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import { getDashboardStats } from "../services/adminService.js";
import { getUsers } from "../services/userService.js";

export const getAdminDashboardStats = asyncHandler(async (_req, res) => {
  const stats = await getDashboardStats();
  return successResponse(res, stats);
});

export const getUsersHandler = asyncHandler(async (_req, res) => {
  const users = await getUsers();
  return successResponse(res, users);
});
