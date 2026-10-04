import prisma from "../prisma/client.js";
import AppError from "../utils/appError.js";
import { getOrCreateCart } from "./cartService.js";

const orderIncludes = {
  items: true,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true
    }
  }
};

export const createOrder = async (userId, shippingPayload) => {
  const cart = await getOrCreateCart(userId);

  if (!cart.items.length) {
    throw new AppError("Cart cannot be empty", 400);
  }

  cart.items.forEach((item) => {
    if (item.quantity > item.product.stock) {
      throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
    }
  });

  const { subtotal, discount, deliveryFee, total } = cart.totals;

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        subtotal,
        discount,
        deliveryFee,
        total,
        paymentMethod: shippingPayload.paymentMethod || "COD",
        paymentStatus: "PENDING",
        status: "PENDING",
        shippingAddress: {
          fullName: shippingPayload.fullName,
          phone: shippingPayload.phone,
          address: shippingPayload.address,
          city: shippingPayload.city,
          postalCode: shippingPayload.postalCode,
          instructions: shippingPayload.deliveryInstructions || ""
        },
        items: {
          create: cart.items.map((item) => {
            const effectivePrice = Number(item.product.discountPrice ?? item.product.price);
            return {
              productId: item.productId,
              name: item.product.name,
              image: item.product.image,
              price: effectivePrice,
              unit: item.product.unit,
              quantity: item.quantity,
              lineTotal: Number((effectivePrice * item.quantity).toFixed(2))
            };
          })
        }
      },
      include: orderIncludes
    });

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity
          }
        }
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return createdOrder;
  });

  return order;
};

export const getOrders = async (userId, role) => {
  const where = role === "ADMIN" ? {} : { userId };

  return prisma.order.findMany({
    where,
    include: orderIncludes,
    orderBy: { createdAt: "desc" }
  });
};

export const getOrderById = async (orderId, userId, role) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: orderIncludes
  });

  if (!order) {
    throw new AppError("Order not found", 404);
  }

  if (role !== "ADMIN" && order.userId !== userId) {
    throw new AppError("Forbidden", 403);
  }

  return order;
};

export const updateOrderStatus = async (orderId, status) => {
  const existing = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existing) {
    throw new AppError("Order not found", 404);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: orderIncludes
  });
};
