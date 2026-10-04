import { asyncHandler } from "../utils/asyncHandler.js";
import { messageResponse, successResponse } from "../utils/apiResponse.js";
import {
  addAddress,
  changePassword,
  getProfile,
  removeAddress,
  updateProfile
} from "../services/userService.js";

export const getProfileHandler = asyncHandler(async (req, res) => {
  const profile = await getProfile(req.user.id);
  return successResponse(res, profile);
});

export const updateProfileHandler = asyncHandler(async (req, res) => {
  const profile = await updateProfile(req.user.id, req.body);
  return successResponse(res, profile);
});

export const changePasswordHandler = asyncHandler(async (req, res) => {
  await changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
  return messageResponse(res, "Password changed successfully");
});

export const addAddressHandler = asyncHandler(async (req, res) => {
  const address = await addAddress(req.user.id, req.body);
  return successResponse(res, address, 201);
});

export const removeAddressHandler = asyncHandler(async (req, res) => {
  await removeAddress(req.user.id, req.params.addressId);
  return messageResponse(res, "Address removed");
});
