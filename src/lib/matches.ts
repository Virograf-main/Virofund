import toast from "react-hot-toast";
import { base_url } from "./constants";
import { handleApiError, checkRateLimit } from "@/lib/middleware";
import { ConnectionRequest, ConnectionStatusResult } from "@/types/matches";
import { createChat } from "@/lib/chats";

export const getMatches = async () => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    const response = await fetch(`${base_url}/matches`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    checkRateLimit(response);
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
      return;
    }

    const response = await fetch(`${base_url}/matches/browse`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    checkRateLimit(response);
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

    checkRateLimit(response);
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

    checkRateLimit(response);
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

    checkRateLimit(response);
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

    checkRateLimit(res);
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

    checkRateLimit(res);
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

// There's no dedicated "connections" endpoint — a connection is just a
// ConnectionRequest (incoming or sent) whose status is "accepted". These
// two helpers derive connection state from /matches/incoming + /matches/sent.

/**
 * Figures out where the logged-in user stands with a specific other user
 * (by their userId, i.e. Founder.userId / UserInfo.id) — none / pending /
 * accepted — by checking both incoming and sent requests.
 */
export const getConnectionStatusWithUser = async (
  otherUserId: string
): Promise<ConnectionStatusResult> => {
  const [incoming, sent] = await Promise.all([
    getIncomingRequests(),
    getSentRequests(),
  ]);

  const incomingMatch = (incoming || []).find(
    (r: ConnectionRequest) => r.sender.id === otherUserId
  );
  if (incomingMatch) {
    if (incomingMatch.status === "accepted") {
      return { status: "accepted", request: incomingMatch };
    }
    if (incomingMatch.status === "pending") {
      return { status: "pending_incoming", request: incomingMatch };
    }
  }

  const sentMatch = (sent || []).find(
    (r: ConnectionRequest) => r.receiver.id === otherUserId
  );
  if (sentMatch) {
    if (sentMatch.status === "accepted") {
      return { status: "accepted", request: sentMatch };
    }
    if (sentMatch.status === "pending") {
      return { status: "pending_sent", request: sentMatch };
    }
  }

  return { status: "none" };
};

/**
 * Returns every accepted connection (people the user is actually connected
 * with), combining both directions and deduping by request id.
 */
export const getConnections = async (): Promise<ConnectionRequest[]> => {
  const [incoming, sent] = await Promise.all([
    getIncomingRequests(),
    getSentRequests(),
  ]);

  const accepted = [
    ...(incoming || []).filter((r: ConnectionRequest) => r.status === "accepted"),
    ...(sent || []).filter((r: ConnectionRequest) => r.status === "accepted"),
  ];

  const byId = new Map(accepted.map((r) => [r.id, r]));
  return Array.from(byId.values());
};
