import slugify from "slugify";
import prisma from "../prisma/client.js";
import AppError from "../utils/appError.js";

export const getCategories = async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" }
  });
};

export const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    throw new AppError("Category not found", 404);
  }
  return category;
};

export const createCategory = async (payload) => {
  const slug = slugify(payload.name, { lower: true, strict: true });
  return prisma.category.create({
    data: {
      ...payload,
      slug
    }
  });
};

export const updateCategory = async (id, payload) => {
  await getCategoryById(id);

  const data = { ...payload };
  if (payload.name) {
    data.slug = slugify(payload.name, { lower: true, strict: true });
  }

  return prisma.category.update({
    where: { id },
    data
  });
};

export const deleteCategory = async (id) => {
  await getCategoryById(id);
  await prisma.category.delete({ where: { id } });
};
