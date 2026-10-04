import api from "./api";

export const getCartRequest = async () => {
  const { data } = await api.get("/cart");
  return data.data;
};

export const addToCartRequest = async (payload) => {
  const { data } = await api.post("/cart", payload);
  return data.data;
};

export const updateCartItemRequest = async (itemId, payload) => {
  const { data } = await api.put(`/cart/${itemId}`, payload);
  return data.data;
};

export const removeCartItemRequest = async (itemId) => {
  const { data } = await api.delete(`/cart/${itemId}`);
  return data.data;
};

export const clearCartRequest = async () => {
  const { data } = await api.delete("/cart");
  return data;
};
