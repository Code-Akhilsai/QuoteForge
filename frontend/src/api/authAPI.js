import axiosInstance from "./axiosInstance";

export const authAPI = {
  register: (data) => axiosInstance.post("/auth/register", data),
  login: (data) => axiosInstance.post("/auth/login", data),
  logout: () => axiosInstance.get("/auth/logout"),
  me: () => axiosInstance.get("/auth/me"),
};
