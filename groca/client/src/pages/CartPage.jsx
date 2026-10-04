import { Link } from "react-router-dom";

import CartItem from "../components/CartItem";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/formatters";
import EmptyState from "../components/ui/EmptyState";

const CartPage = () => {
  const { cart, totals, updateQuantity, removeItem, clearCart } = useCart();

  if (!cart?.items?.length) {
    return <EmptyState title="Your cart is empty" description="Add fresh groceries from our shop to get started." action={<Link className="btn-primary" to="/shop">Start shopping</Link>} />;
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
        <h2 className="text-xl font-bold text-slate-800">Order summary</h2>
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
            <span>Delivery fee</span>
            <span>{formatCurrency(totals.deliveryFee)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-800">
            <span>Total</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>

        <Link className="btn-primary block w-full text-center" to="/checkout">
          Proceed to checkout
        </Link>
        <button className="btn-secondary w-full" onClick={clearCart} type="button">
          Clear cart
        </button>
      </aside>
    </div>
  );
};

export default CartPage;
