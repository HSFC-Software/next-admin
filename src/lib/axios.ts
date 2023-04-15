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
  baseURL: process.env.NEXT_PUBLIC_EDGE_FUNCTION_URL,
  timeout: 10000,
  headers: {
    Authorization: process.env.NEXT_PUBLIC_SUPABASE_KEY,
  },
});

export default axios;
export { edgeFunction };
