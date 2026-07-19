import toast from "react-hot-toast";
import { base_url } from "./constants";
import { handleApiError, checkRateLimit } from "@/lib/middleware";
import { Notification } from "@/types/notifications";

export const getNotifications = async (
  offset = 0,
  limit = 10
): Promise<Notification[]> => {
  try {
    if (typeof window === "undefined") return [];
    const token = localStorage.getItem("accessToken");
    if (!token) return [];

    const response = await fetch(
      `${base_url}/notifications?offset=${offset}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    checkRateLimit(response);
    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    toast.error("Failed to fetch notifications");
    return [];
  }
};

export const markNotificationAsRead = async (
  id: string
): Promise<Notification | null> => {
  try {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const response = await fetch(`${base_url}/notifications/${id}/read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    checkRateLimit(response);
    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error marking notification as read:", error);
    toast.error("Failed to update notification");
    return null;
  }
};

export const markAllNotificationsAsRead = async (): Promise<number> => {
  try {
    if (typeof window === "undefined") return 0;
    const token = localStorage.getItem("accessToken");
    if (!token) return 0;

    const response = await fetch(`${base_url}/notifications/read-all`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    checkRateLimit(response);
    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      return 0;
    }

    const data = await response.json();
    return data.updated ?? 0;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    toast.error("Failed to update notifications");
    return 0;
  }
};
