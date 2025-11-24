import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { base_url } from "./constants";
import { handleApiError } from "@/lib/middleware";

export const generateMatch = async (router: AppRouterInstance) => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("No access token found in localStorage");
      return;
    }

    const response = await fetch(`${base_url}/matches/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      handleApiError(response);
      return [];
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error creating profile:", error);
    toast.error("Failed to create profile");
    return;
  }
};
export const getMatches = async () => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("No access token found in localStorage");
      return;
    }

    const response = await fetch(`${base_url}/matches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      handleApiError(response);
      return;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating profile:", error);
    toast.error("Failed to create profile");
    return;
  }
};
