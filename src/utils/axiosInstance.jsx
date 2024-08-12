import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  withCredentials: true,
});
export const logOut = () => {
  localStorage.clear();
  window.location.href = "/login";
};
