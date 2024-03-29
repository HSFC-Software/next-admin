import api from "axios";

/**
 * @deprecated
 */
const axios = api.create({
  baseURL: "https://api.fishgen.org",
  timeout: 10000,
});

axios.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("access_token");
    // config.headers.Authorization = `Bearer ${token}`;
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
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_KEY}`,
    client_id: "directors-access",
  },
});

export default axios;
export { edgeFunction };
