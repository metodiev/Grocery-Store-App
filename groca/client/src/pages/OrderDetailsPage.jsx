import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useLanguage } from "../hooks/useLanguage";
import { getOrderRequest } from "../services/orderService";
import { localizeProductNameFromText } from "../utils/catalogLocalization";
import { formatCurrency, formatDate } from "../utils/formatters";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { language, t } = useLanguage();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    getOrderRequest(id).then(setOrder);
  }, [id]);

  if (!order) {
    return <p>{t("loadingOrder")}</p>;
  }

  return (
    <div className="space-y-5">
      <section className="card p-6">
        <h1 className="text-2xl font-bold text-slate-800">{t("orderDetails")}</h1>
        <p className="mt-2 text-sm text-slate-600">{t("placedOn", { date: formatDate(order.createdAt) })}</p>
        <p className="mt-1 text-sm text-slate-600">{t("status")}: <span className="font-semibold text-brand-dark">{order.status}</span></p>
        <p className="mt-1 text-sm text-slate-600">{t("payment", { method: order.paymentMethod, status: order.paymentStatus })}</p>
      </section>

      <section className="card p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-800">{t("items")}</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div className="flex items-center justify-between border-b border-slate-100 pb-3" key={item.id}>
              <div className="flex items-center gap-3">
                <img alt={item.name} className="h-16 w-16 rounded-xl object-cover" src={item.image} />
                <div>
                  <p className="font-semibold text-slate-800">{localizeProductNameFromText(item.name, language)}</p>
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
