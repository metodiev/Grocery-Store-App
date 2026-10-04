import { asyncHandler } from "../utils/asyncHandler.js";
import { successResponse } from "../utils/apiResponse.js";
import { getCurrentUser, loginUser, registerUser } from "../services/authService.js";

export const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);
  return successResponse(res, result, 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  return successResponse(res, result);
});

export const me = asyncHandler(async (req, res) => {
  const user = await getCurrentUser(req.user.id);
  return successResponse(res, user);
});
