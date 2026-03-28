import { api } from "./api";

export const checkIn = () => {
  return api.post("/attendance/check-in");
};

export const checkOut = () => {
  return api.post("/attendance/check-out");
};

export const getMyAttendance = () => {
  return api.get("/attendance/me");
};

export const getUserAttendance = (userId: string) => {
  return api.get(`/attendance/user/${userId}`);
};
