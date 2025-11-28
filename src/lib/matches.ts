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
      const error = await response.json();
      handleApiError(error);
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
      const error = await response.json();
      handleApiError(error);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating profile:", error);
    toast.error("Failed to create profile");
    return;
  }
};

/**
 * Sends a match request to a specific user
 * @param userId - the user ID
 * @returns json of sender and receiver id
 */
export const sendRequest = async (userId: string) => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Unauthorized, please log in again");
      return;
    }

    const response = await fetch(`${base_url}/matches/request/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      return;
    }
    const data = await response.json();
    console.log(data);
    toast.success("Request sent successfully");
    return data;
  } catch (error) {
    console.error("Error creating profile:", error);
    toast.error("Failed to create profile");
    return;
  }
};

/**
 * Get all match requests sent to the user
 * @returns json of match requests
 */

export const getIncomingRequests = async () => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Unauthorized, please log in again");
      return;
    }

    const response = await fetch(`${base_url}/matches/incoming`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      return [];
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating profile:", error);
    toast.error("Failed to create profile");
    return;
  }
};
