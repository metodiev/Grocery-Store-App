import prisma from "../prisma/client.js";

const toNumber = (value) => Number(value || 0);

const toDateKey = (dateValue) => {
  return new Date(dateValue).toISOString().slice(0, 10);
};

const toFriendlyDate = (isoDateKey) => {
  return new Date(isoDateKey).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
};

export const getDashboardStats = async () => {
  const [usersCount, productsCount, orders, pendingOrders, recentOrders, bestSelling] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.findMany({ include: { items: true } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { user: true } }),
    prisma.orderItem.groupBy({
      by: ["productId", "name"],
      _sum: { quantity: true, lineTotal: true },
      orderBy: {
        _sum: {
          quantity: "desc"
        }
      },
      take: 6
    })
  ]);

  const totalRevenue = orders.reduce((sum, order) => sum + toNumber(order.total), 0);

  const ordersByStatus = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"].map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length
  }));

  const today = new Date();
  const revenueIndex = {};
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = toDateKey(date);
    revenueIndex[key] = {
      date: toFriendlyDate(key),
      revenue: 0,
      orders: 0
    };
  }

  orders.forEach((order) => {
    const key = toDateKey(order.createdAt);
    if (!revenueIndex[key]) {
      return;
    }

    revenueIndex[key].revenue += toNumber(order.total);
    revenueIndex[key].orders += 1;
  });

  const revenueByDay = Object.values(revenueIndex).map((entry) => ({
    ...entry,
    revenue: Number(entry.revenue.toFixed(2))
  }));

  return {
    totalUsers: usersCount,
    totalProducts: productsCount,
    totalOrders: orders.length,
    pendingOrders,
    totalRevenue: Number(totalRevenue.toFixed(2)),
    recentOrders,
    bestSellingProducts: bestSelling.map((item) => ({
      productId: item.productId,
      name: item.name,
      soldQuantity: item._sum.quantity || 0,
      revenue: toNumber(item._sum.lineTotal).toFixed(2)
    })),
    ordersByStatus,
    revenueByDay
  };
};
