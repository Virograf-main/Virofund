import toast from "react-hot-toast";
import { base_url } from "./constants";
import { handleApiError } from "@/lib/middleware";

export const getIncomingRequests = async () => {
  try {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Unauthorized, please log in again");
      return [];
    }

    const response = await fetch(`${base_url}/matches/requests/incoming`, {
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
    console.error("Error fetching incoming requests:", error);
    toast.error("Failed to fetch incoming requests");
    return [];
  }
};

export const approveRequest = async (requestId: string) => {
  try {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Unauthorized, please log in again");
      return;
    }

    const response = await fetch(
      `${base_url}/matches/requests/${requestId}/approve`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      return;
    }

    toast.success("Request approved");
    return await response.json();
  } catch (error) {
    console.error("Error approving request:", error);
    toast.error("Failed to approve request");
    return;
  }
};

export const rejectRequest = async (requestId: string) => {
  try {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Unauthorized, please log in again");
      return;
    }

    const response = await fetch(
      `${base_url}/matches/requests/${requestId}/reject`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      return;
    }

    toast.success("Request rejected");
    return await response.json();
  } catch (error) {
    console.error("Error rejecting request:", error);
    toast.error("Failed to reject request");
    return;
  }
};
