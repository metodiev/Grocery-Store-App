import bcrypt from "bcryptjs";
import prisma from "../prisma/client.js";
import AppError from "../utils/appError.js";

const profileSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  createdAt: true,
  updatedAt: true,
  addresses: true
};

export const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: profileSelect
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const updateProfile = async (userId, payload) => {
  return prisma.user.update({
    where: { id: userId },
    data: payload,
    select: profileSelect
  });
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  });
};

export const addAddress = async (userId, payload) => {
  return prisma.address.create({
    data: {
      ...payload,
      userId
    }
  });
};

export const removeAddress = async (userId, addressId) => {
  const address = await prisma.address.findUnique({ where: { id: addressId } });
  if (!address || address.userId !== userId) {
    throw new AppError("Address not found", 404);
  }

  await prisma.address.delete({ where: { id: addressId } });
};

export const getUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          orders: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
