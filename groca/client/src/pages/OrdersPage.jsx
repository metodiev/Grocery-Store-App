import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import EmptyState from "../components/ui/EmptyState";
import { getOrdersRequest } from "../services/orderService";
import { formatCurrency, formatDate } from "../utils/formatters";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrdersRequest().then(setOrders);
  }, []);

  if (!orders.length) {
    return <EmptyState title="No orders yet" description="When you place your first order, it will appear here." />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div className="card p-5" key={order.id}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase text-slate-500">Order ID</p>
              <p className="font-semibold text-slate-800">{order.id}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Date</p>
              <p className="font-semibold text-slate-800">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Status</p>
              <p className="font-semibold text-brand-dark">{order.status}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">Total</p>
              <p className="font-semibold text-slate-800">{formatCurrency(order.total)}</p>
            </div>
            <Link className="btn-secondary" to={`/orders/${order.id}`}>
              View details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
