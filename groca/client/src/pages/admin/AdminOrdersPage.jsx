import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getOrdersRequest, updateOrderStatusRequest } from "../../services/orderService";
import { formatCurrency, formatDate } from "../../utils/formatters";

const statuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const data = await getOrdersRequest();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    await updateOrderStatusRequest(orderId, { status });
    toast.success("Order status updated");
    fetchOrders();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
      <div className="card overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-left text-slate-600">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr className="border-b border-slate-100" key={order.id}>
                <td className="px-4 py-3 font-semibold text-slate-700">{order.id.slice(0, 10)}...</td>
                <td className="px-4 py-3">{order.user?.name}</td>
                <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3">
                  <select className="rounded-lg border border-slate-200 px-2 py-1" value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
