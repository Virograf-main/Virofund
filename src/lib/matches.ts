import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { base_url } from "./constants";

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
      switch (response.status) {
        case 400:
          toast.error("Bad request. Please check your inputs.");
          return [];
        case 401:
          toast.error("Unauthorized. Please log in again.");
          // Optionally clear token and redirect to login
          localStorage.removeItem("accessToken");
          router.push("/");
          return [];
        case 403:
          toast.error(
            "Forbidden. You don’t have permission to perform this action."
          );
          return [];
        case 404:
          toast.error("Resource not found. Please try again later.");
          return [];
        case 409:
          toast.error("User profile already exists.");
          return [];
        case 422:
          toast.error("Invalid data. Please review your inputs.");
          return [];
        case 500:
          toast.error("Server error. Please try again later.");
          return [];
        default:
          toast.error(
            `Unexpected error ${response.status}: ${response.statusText}`
          );
          return [];
      }
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
    const data = await response.json();
    console.log(data);
    // useUserStore.getState().setUser(data);

    if (!response.ok) {
      switch (response.status) {
        case 400:
          toast.error("Bad request. Please check your inputs.");
          break;
        case 401:
          toast.error("Unauthorized. Please log in again.");
          // Optionally clear token and redirect to login
          localStorage.removeItem("accessToken");
          break;
        case 403:
          toast.error(
            "Forbidden. You don’t have permission to perform this action."
          );
          break;
        case 404:
          toast.error("Resource not found. Please try again later.");
          break;
        case 409:
          toast.error("User profile already exists.");
          break;
        case 422:
          toast.error("Invalid data. Please review your inputs.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(
            `Unexpected error ${response.status}: ${response.statusText}`
          );
      }
      // setLoading(false);
    }
  } catch (error) {
    // setLoading(false);
    console.error("Error creating profile:", error);
    toast.error("Failed to create profile");
    return;
  } finally {
    // setLoading(false);
  }
};
