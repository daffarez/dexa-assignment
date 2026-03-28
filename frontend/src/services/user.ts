import { api } from "./api";

export const updateProfile = async (data: any) => {
  const res = await api.patch("/user/profile", data);
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/user/all");
  return res.data;
};

export const updateUserByAdmin = async (userId: string, data: any) => {
  const res = await api.patch(`/user/${userId}`, data);
  return res.data;
};
