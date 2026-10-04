import api from "./api";

export const getProfileRequest = async () => {
  const { data } = await api.get("/users/me");
  return data.data;
};

export const updateProfileRequest = async (payload) => {
  const { data } = await api.put("/users/me", payload);
  return data.data;
};

export const changePasswordRequest = async (payload) => {
  const { data } = await api.put("/users/me/password", payload);
  return data;
};

export const addAddressRequest = async (payload) => {
  const { data } = await api.post("/users/me/addresses", payload);
  return data.data;
};

export const removeAddressRequest = async (addressId) => {
  const { data } = await api.delete(`/users/me/addresses/${addressId}`);
  return data;
};
