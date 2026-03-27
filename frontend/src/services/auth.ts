import { api } from "./api";

export const login = async (data: { email: string; password: string }) => {
  const res = await api.post("/auth/login", data);
  return res.data.data;
};

export const register = async (data: any) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};
