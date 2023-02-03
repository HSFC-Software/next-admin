import api from "axios";

const axios = api.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // TODO: handle errors
  }
);

export default axios;
