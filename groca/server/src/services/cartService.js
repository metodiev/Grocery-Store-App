import prisma from "../prisma/client.js";
import AppError from "../utils/appError.js";

const DELIVERY_FEE = 4.99;
const FREE_DELIVERY_MIN = 35;

const toNumber = (value) => Number(value ?? 0);

const calculateCartTotals = (items) => {
  const subtotal = items.reduce((sum, item) => {
    const effectivePrice = toNumber(item.product.discountPrice ?? item.product.price);
    return sum + effectivePrice * item.quantity;
  }, 0);

  const discount = items.reduce((sum, item) => {
    const basePrice = toNumber(item.product.price);
    const effectivePrice = toNumber(item.product.discountPrice ?? item.product.price);
    return sum + Math.max(0, basePrice - effectivePrice) * item.quantity;
  }, 0);

  const deliveryFee = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
  const total = subtotal + deliveryFee;

  return {
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    deliveryFee: Number(deliveryFee.toFixed(2)),
    total: Number(total.toFixed(2))
  };
};

export const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: { category: true }
          }
        }
      }
    }
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true }
            }
          }
        }
      }
    });
  }

  return {
    ...cart,
    totals: calculateCartTotals(cart.items)
  };
};

export const addItemToCart = async (userId, productId, quantity) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) {
    throw new AppError("Product not found", 404);
  }

  if (product.stock < quantity) {
    throw new AppError("Insufficient stock", 400);
  }

  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId }
  });

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId
      }
    }
  });

  const newQuantity = (existingItem?.quantity || 0) + quantity;
  if (newQuantity > product.stock) {
    throw new AppError("Requested quantity exceeds stock", 400);
  }

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity }
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity
      }
    });
  }

  return getOrCreateCart(userId);
};

export const updateCartItem = async (userId, itemId, quantity) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const cartItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true }
  });

  if (!cartItem || cartItem.cartId !== cart.id) {
    throw new AppError("Cart item not found", 404);
  }

  if (quantity > cartItem.product.stock) {
    throw new AppError("Requested quantity exceeds stock", 400);
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity }
  });

  return getOrCreateCart(userId);
};

export const removeCartItem = async (userId, itemId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const cartItem = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!cartItem || cartItem.cartId !== cart.id) {
    throw new AppError("Cart item not found", 404);
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getOrCreateCart(userId);
};

export const clearCart = async (userId) => {
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    return getOrCreateCart(userId);
  }

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  return getOrCreateCart(userId);
};
