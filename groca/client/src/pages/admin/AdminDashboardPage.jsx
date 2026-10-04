import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import { getAdminStatsRequest } from "../../services/adminService";
import { formatCurrency, formatDate } from "../../utils/formatters";

const STATUS_COLORS = {
  PENDING: "#F59E0B",
  CONFIRMED: "#22C55E",
  PROCESSING: "#3B82F6",
  SHIPPED: "#8B5CF6",
  DELIVERED: "#16A34A",
  CANCELLED: "#EF4444"
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStatsRequest().then(setStats);
  }, []);

  if (!stats) {
    return <p>Loading dashboard...</p>;
  }

  const cards = [
    ["Total users", stats.totalUsers],
    ["Total products", stats.totalProducts],
    ["Total orders", stats.totalOrders],
    ["Pending orders", stats.pendingOrders],
    ["Total revenue", formatCurrency(stats.totalRevenue)]
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([label, value]) => (
          <div className="card p-5" key={label}>
            <p className="text-xs uppercase text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-brand-dark">{value}</p>
          </div>
        ))}
      </div>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-800">Revenue (last 7 days)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fill: "#64748B", fontSize: 12 }} />
                <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="revenue" fill="#16A34A" radius={[6, 6, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-800">Order status distribution</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.ordersByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >
                  {stats.ordersByStatus.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || "#94A3B8"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Recent orders</h2>
        <div className="space-y-3">
          {stats.recentOrders.map((order) => (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2" key={order.id}>
              <span className="font-semibold text-slate-700">{order.user?.name}</span>
              <span className="text-sm text-slate-500">{formatDate(order.createdAt)}</span>
              <span className="text-sm font-semibold text-brand-dark">{order.status}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Best-selling products</h2>
        <div className="space-y-3">
          {stats.bestSellingProducts.map((product) => (
            <div className="flex items-center justify-between border-b border-slate-100 pb-2" key={product.productId}>
              <span className="font-semibold text-slate-700">{product.name}</span>
              <span className="text-sm text-slate-500">Sold: {product.soldQuantity}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboardPage;
