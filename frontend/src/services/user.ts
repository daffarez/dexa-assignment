import { api } from "./api";

export const updateProfile = async (data: any) => {
  const res = await api.patch("/users/profile", data);
  return res.data;
};

export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};
