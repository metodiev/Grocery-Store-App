import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createOrderRequest } from "../services/orderService";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../hooks/useLanguage";
import { formatCurrency } from "../utils/formatters";

const initialState = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  deliveryInstructions: "",
  paymentMethod: "COD"
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, totals, refreshCart } = useCart();
  const { t } = useLanguage();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await createOrderRequest(form);
      await refreshCart();
      toast.success(t("toastOrderPlaced"));
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || t("toastOrderFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form className="card space-y-4 p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold text-slate-800">{t("checkout")}</h1>

        <input className="input" placeholder={t("fullName")} required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="input" placeholder={t("phone")} required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder={t("address")} required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder={t("city")} required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input
            className="input"
            placeholder={t("postalCode")}
            required
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          />
        </div>
        <textarea
          className="input min-h-24"
          placeholder={t("deliveryInstructions")}
          value={form.deliveryInstructions}
          onChange={(e) => setForm({ ...form, deliveryInstructions: e.target.value })}
        />

        <div className="rounded-xl border border-brand-secondary/20 bg-brand-secondary/10 p-4 text-sm text-brand-dark">{t("paymentCodInfo")}</div>

        <button className="btn-primary w-full" disabled={loading || !cart?.items?.length} type="submit">
          {loading ? t("placingOrder") : t("placeOrder")}
        </button>
      </form>

      <aside className="card h-fit space-y-3 p-5">
        <h2 className="text-lg font-bold text-slate-800">{t("summary")}</h2>
        <p className="text-sm text-slate-500">{t("itemsCount", { count: cart?.items?.length || 0 })}</p>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>{t("subtotal")}</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("discount")}</span>
            <span>-{formatCurrency(totals.discount)}</span>
          </div>
          <div className="flex justify-between">
            <span>{t("delivery")}</span>
            <span>{formatCurrency(totals.deliveryFee)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 font-bold text-slate-800">
            <span>{t("total")}</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CheckoutPage;
