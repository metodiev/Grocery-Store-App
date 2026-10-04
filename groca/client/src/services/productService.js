import api from "./api";

export const getProductsRequest = async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data.data;
};

export const getProductRequest = async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
};

export const createProductRequest = async (payload) => {
  const { data } = await api.post("/products", payload);
  return data.data;
};

export const updateProductRequest = async (id, payload) => {
  const { data } = await api.put(`/products/${id}`, payload);
  return data.data;
};

export const deleteProductRequest = async (id) => {
  const { data } = await api.delete(`/products/${id}`);
  return data;
};
