import { asyncHandler } from "../utils/asyncHandler.js";
import { messageResponse, successResponse } from "../utils/apiResponse.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory
} from "../services/categoryService.js";

export const listCategories = asyncHandler(async (_req, res) => {
  const categories = await getCategories();
  return successResponse(res, categories);
});

export const getCategory = asyncHandler(async (req, res) => {
  const category = await getCategoryById(req.params.id);
  return successResponse(res, category);
});

export const createCategoryHandler = asyncHandler(async (req, res) => {
  const category = await createCategory(req.body);
  return successResponse(res, category, 201);
});

export const updateCategoryHandler = asyncHandler(async (req, res) => {
  const category = await updateCategory(req.params.id, req.body);
  return successResponse(res, category);
});

export const deleteCategoryHandler = asyncHandler(async (req, res) => {
  await deleteCategory(req.params.id);
  return messageResponse(res, "Category deleted");
});
