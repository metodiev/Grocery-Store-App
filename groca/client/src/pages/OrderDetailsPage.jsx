import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getOrderRequest } from "../services/orderService";
import { formatCurrency, formatDate } from "../utils/formatters";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderRequest(id).then(setOrder);
  }, [id]);

  if (!order) {
    return <p>Loading order...</p>;
  }

  return (
    <div className="space-y-5">
      <section className="card p-6">
        <h1 className="text-2xl font-bold text-slate-800">Order details</h1>
        <p className="mt-2 text-sm text-slate-600">Placed on {formatDate(order.createdAt)}</p>
        <p className="mt-1 text-sm text-slate-600">Status: <span className="font-semibold text-brand-dark">{order.status}</span></p>
        <p className="mt-1 text-sm text-slate-600">Payment: {order.paymentMethod} ({order.paymentStatus})</p>
      </section>

      <section className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-800">Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div className="flex items-center justify-between border-b border-slate-100 pb-3" key={item.id}>
              <div className="flex items-center gap-3">
                <img alt={item.name} className="h-16 w-16 rounded-xl object-cover" src={item.image} />
                <div>
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.quantity} x {formatCurrency(item.price)}</p>
                </div>
              </div>
              <p className="font-semibold text-slate-800">{formatCurrency(item.lineTotal)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default OrderDetailsPage;
