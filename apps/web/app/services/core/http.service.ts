import axios from "axios";
import { cookiesService } from "./cookies.service";

const request = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API_URL,
  timeout: 30000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Change request data/error here
request.interceptors.request.use(
  async (config: any) => {
    const token = cookiesService.getAuthToken();
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token ? token : ""}`,
    };
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

export default request;
