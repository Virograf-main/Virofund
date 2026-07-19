// lib/axios.ts
import axios from "axios";
import { checkRateLimitAxios } from "./middleware";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    checkRateLimitAxios(response.status, response.headers as Record<string, string>);
    return response;
  },
  (error) => {
    if (error.response) {
      checkRateLimitAxios(
        error.response.status,
        error.response.headers as Record<string, string>
      );
    }
    return Promise.reject(error);
  }
);
