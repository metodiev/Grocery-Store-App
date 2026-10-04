import { createContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  addToCartRequest,
  clearCartRequest,
  getCartRequest,
  removeCartItemRequest,
  updateCartItemRequest
} from "../services/cartService";
import { useLanguage } from "../hooks/useLanguage";

export const CartContext = createContext(null);

export const CartProvider = ({ children, isAuthenticated }) => {
  const { t } = useLanguage();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    try {
      setLoading(true);
      const freshCart = await getCartRequest();
      setCart(freshCart);
    } catch (_error) {
      toast.error(t("toastCartLoadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    const updatedCart = await addToCartRequest({ productId, quantity });
    setCart(updatedCart);
    toast.success(t("toastProductAdded"));
  };

  const updateQuantity = async (itemId, quantity) => {
    const updatedCart = await updateCartItemRequest(itemId, { quantity });
    setCart(updatedCart);
  };

  const removeItem = async (itemId) => {
    const updatedCart = await removeCartItemRequest(itemId);
    setCart(updatedCart);
    toast.success(t("toastItemRemoved"));
  };

  const clearCart = async () => {
    await clearCartRequest();
    await refreshCart();
    toast.success(t("toastCartCleared"));
  };

  const value = useMemo(
    () => ({
      cart,
      loading,
      itemCount: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
      totals: cart?.totals || { subtotal: 0, discount: 0, deliveryFee: 0, total: 0 },
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart
    }),
    [cart, loading]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
