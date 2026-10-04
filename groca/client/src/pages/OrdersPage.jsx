import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import EmptyState from "../components/ui/EmptyState";
import { useLanguage } from "../hooks/useLanguage";
import { getOrdersRequest } from "../services/orderService";
import { formatCurrency, formatDate } from "../utils/formatters";

const OrdersPage = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrdersRequest().then(setOrders);
  }, []);

  if (!orders.length) {
    return <EmptyState title={t("noOrdersYet")} description={t("noOrdersDesc")} />;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div className="card p-5" key={order.id}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase text-slate-500">{t("orderId")}</p>
              <p className="font-semibold text-slate-800">{order.id}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">{t("date")}</p>
              <p className="font-semibold text-slate-800">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">{t("status")}</p>
              <p className="font-semibold text-brand-dark">{order.status}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-500">{t("total")}</p>
              <p className="font-semibold text-slate-800">{formatCurrency(order.total)}</p>
            </div>
            <Link className="btn-secondary" to={`/orders/${order.id}`}>
              {t("viewDetails")}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersPage;
