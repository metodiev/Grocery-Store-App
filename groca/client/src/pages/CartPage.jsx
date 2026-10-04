import { Link } from "react-router-dom";

import CartItem from "../components/CartItem";
import { useCart } from "../hooks/useCart";
import { useLanguage } from "../hooks/useLanguage";
import { formatCurrency } from "../utils/formatters";
import EmptyState from "../components/ui/EmptyState";

const CartPage = () => {
  const { t } = useLanguage();
  const { cart, totals, updateQuantity, removeItem, clearCart } = useCart();

  if (!cart?.items?.length) {
    return <EmptyState title={t("cartEmptyTitle")} description={t("cartEmptyDesc")} action={<Link className="btn-primary" to="/shop">{t("startShopping")}</Link>} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        {cart.items.map((item) => (
          <CartItem
            item={item}
            key={item.id}
            onDecrease={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </section>

      <aside className="card h-fit space-y-4 p-5">
        <h2 className="text-xl font-bold text-slate-800">{t("orderSummary")}</h2>
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
            <span>{t("deliveryFee")}</span>
            <span>{formatCurrency(totals.deliveryFee)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-800">
            <span>{t("total")}</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>

        <Link className="btn-primary block w-full text-center" to="/checkout">
          {t("proceedCheckout")}
        </Link>
        <button className="btn-secondary w-full" onClick={clearCart} type="button">
          {t("clearCart")}
        </button>
      </aside>
    </div>
  );
};

export default CartPage;
