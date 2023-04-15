import api from "axios";

const axios = api.create({
  baseURL: "https://api.fishgen.org",
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

const edgeFunction = api.create({
  baseURL: "https://bsnrwmmolcbhgncwogox.functions.supabase.co",
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
export { edgeFunction };
