import slugify from "slugify";
import prisma from "../prisma/client.js";
import AppError from "../utils/appError.js";
import { getPagination } from "../utils/pagination.js";

const parseSort = (sort) => {
  const map = {
    newest: { createdAt: "desc" },
    price_asc: { price: "asc" },
    price_desc: { price: "desc" },
    name_asc: { name: "asc" },
    name_desc: { name: "desc" }
  };
  return map[sort] || map.newest;
};

export const getProducts = async (query) => {
  const { page, limit, skip } = getPagination(query.page, query.limit);
  const where = {
    isActive: true
  };

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } }
    ];
  }

  if (query.category) {
    where.category = {
      OR: [
        { slug: query.category },
        { id: query.category }
      ]
    };
  }

  if (query.minPrice || query.maxPrice) {
    where.price = {};
    if (query.minPrice) {
      where.price.gte = Number(query.minPrice);
    }
    if (query.maxPrice) {
      where.price.lte = Number(query.maxPrice);
    }
  }

  if (query.featured === "true") {
    where.isFeatured = true;
  }

  if (query.discounted === "true") {
    where.discountPrice = { not: null };
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true
      },
      skip,
      take: limit,
      orderBy: parseSort(query.sort)
    }),
    prisma.product.count({ where })
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true
    }
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true
    },
    take: 4,
    orderBy: { createdAt: "desc" }
  });

  return {
    ...product,
    relatedProducts
  };
};

export const createProduct = async (payload) => {
  const slug = slugify(payload.name, { lower: true, strict: true });

  return prisma.product.create({
    data: {
      ...payload,
      slug
    },
    include: { category: true }
  });
};

export const updateProduct = async (id, payload) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Product not found", 404);
  }

  const data = { ...payload };
  if (payload.name) {
    data.slug = slugify(payload.name, { lower: true, strict: true });
  }

  return prisma.product.update({
    where: { id },
    data,
    include: { category: true }
  });
};

export const deleteProduct = async (id) => {
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Product not found", 404);
  }

  await prisma.product.delete({ where: { id } });
};
