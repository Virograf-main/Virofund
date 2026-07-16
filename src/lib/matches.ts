import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { base_url } from "./constants";
import { handleApiError } from "@/lib/middleware";
import { ConnectionRequest } from "@/types/matches";
import { createChat } from "@/lib/chats";

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
    console.error("Error fetching matches:", error);
    toast.error("Failed to fetch matches");
    return;
  }
};

export const browseProfiles = async () => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("No access token found in localStorage");
      return;
    }

    const response = await fetch(`${base_url}/matches/browse`, {
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
    console.error("Error fetching profiles:", error);
    toast.error("Failed to fetch profiles");
    return;
  }
};

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
    toast.success("Request sent successfully");
    return data;
  } catch (error) {
    console.error("Error sending request:", error);
    toast.error("Failed to send request");
    return;
  }
};

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
    console.error("Error fetching incoming requests:", error);
    toast.error("Failed to fetch incoming requests");
    return;
  }
};

export const getSentRequests = async () => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("Unauthorized, please log in again");
      return;
    }

    const response = await fetch(`${base_url}/matches/sent`, {
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
    console.error("Error fetching sent requests:", error);
    toast.error("Failed to fetch sent requests");
    return;
  }
};

export const approveRequest = async (requestId: string) => {
  const token = localStorage.getItem("accessToken");

  try {
    const res = await fetch(
      `${base_url}/matches/requests/${requestId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "accepted",
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      handleApiError(error);
      return;
    }
    const data: ConnectionRequest = await res.json();
    await createChat(
      data.id,
      data.sender.id,
      data.receiver.id,
      `${data.sender.firstName + " " + data.sender.lastName}`,
      `${data.receiver.firstName + " " + data.receiver.lastName}`
    );
    return data;
  } catch (err) {
    toast.error("Failed to accept request");
    console.log("Error updating request", err);
  }
};

export const rejectRequest = async (requestId: string) => {
  const token = localStorage.getItem("accessToken");
  try {
    const res = await fetch(
      `${base_url}/matches/requests/${requestId}/status`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "rejected",
        }),
      }
    );

    if (!res.ok) {
      const error = await res.json();
      handleApiError(error);
      return;
    }
    return res.json();
  } catch (err) {
    toast.error("Failed to reject request");
    console.log("Error updating request", err);
  }
};
