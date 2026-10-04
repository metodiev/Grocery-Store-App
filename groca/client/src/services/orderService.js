import api from "./api";

export const createOrderRequest = async (payload) => {
  const { data } = await api.post("/orders", payload);
  return data.data;
};

export const getOrdersRequest = async () => {
  const { data } = await api.get("/orders");
  return data.data;
};

export const getOrderRequest = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
};

export const updateOrderStatusRequest = async (id, payload) => {
  const { data } = await api.put(`/orders/${id}/status`, payload);
  return data.data;
};
