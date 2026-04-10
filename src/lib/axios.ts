// lib/axios.ts
import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

instance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken"); // replace with your actual key
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
