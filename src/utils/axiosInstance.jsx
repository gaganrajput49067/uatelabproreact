import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api/v1/",  // No need for full URL
  withCredentials: true,
});

export const axiosReport = axios.create({
  baseURL: "/reports/v1/",  // No need for full URL
  withCredentials: true,
});

export const logOut = () => {
  localStorage.clear();
  window.location.href = "/login";
};
