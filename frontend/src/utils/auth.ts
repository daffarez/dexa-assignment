import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  name: string;
  email: string;
  position: string;
  phone: string;
  photoUrl: string;
  role: "EMPLOYEE" | "ADMIN";
  iat: number;
  exp: number;
}

export const getProfileFromToken = (token: string) => {
  return jwtDecode<User>(token);
};
