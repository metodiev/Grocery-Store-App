import api from "./api";

export const getAdminStatsRequest = async () => {
  const { data } = await api.get("/admin/stats");
  return data.data;
};

export const getAdminUsersRequest = async () => {
  const { data } = await api.get("/admin/users");
  return data.data;
};
