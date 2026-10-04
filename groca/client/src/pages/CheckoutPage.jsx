import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createOrderRequest } from "../services/orderService";
import { useCart } from "../hooks/useCart";
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
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await createOrderRequest(form);
      await refreshCart();
      toast.success("Order placed successfully");
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form className="card space-y-4 p-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>

        <input className="input" placeholder="Full name" required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        <input className="input" placeholder="Phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="input" placeholder="Address" required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="input" placeholder="City" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input
            className="input"
            placeholder="Postal code"
            required
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          />
        </div>
        <textarea
          className="input min-h-24"
          placeholder="Delivery instructions"
          value={form.deliveryInstructions}
          onChange={(e) => setForm({ ...form, deliveryInstructions: e.target.value })}
        />

        <div className="rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-800">Payment method: Cash on Delivery. Architecture is ready for future Stripe integration.</div>

        <button className="btn-primary w-full" disabled={loading || !cart?.items?.length} type="submit">
          {loading ? "Placing order..." : "Place order"}
        </button>
      </form>

      <aside className="card h-fit space-y-3 p-5">
        <h2 className="text-lg font-bold text-slate-800">Summary</h2>
        <p className="text-sm text-slate-500">Items: {cart?.items?.length || 0}</p>
        <div className="space-y-2 text-sm text-slate-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatCurrency(totals.discount)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{formatCurrency(totals.deliveryFee)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 font-bold text-slate-800">
            <span>Total</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CheckoutPage;
