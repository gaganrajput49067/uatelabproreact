import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Use withCredentials instead of credentials
});

export const axiosReport = axios.create({
  baseURL: "http://localhost:8000/reports/v1/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Use withCredentials instead of credentials
});

export const logOut = () => {
  localStorage.clear();
  window.location.href = "/login";
};
