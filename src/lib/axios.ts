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
  baseURL: process.env.NEXT_EDGE_FUNCTION_URL,
  timeout: 10000,
});

axios.interceptors.request.use(
  (config) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzbnJ3bW1vbGNiaGduY3dvZ294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQ3MzM1MTAsImV4cCI6MTk5MDMwOTUxMH0.Vgv78ZxFTJQ1Dl7pCn352dE_TfE_cveRLqEB7pa_w4s"; //test token
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    // TODO: handle errors
  }
);

export default axios;
export { edgeFunction };
