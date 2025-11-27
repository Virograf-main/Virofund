import type { Founder, OnboardingData, UserProfile } from "@/types/userprofile";
import toast from "react-hot-toast";
import { useOnboardingStore } from "@/store/onboardingStore"; // adjust path if needed
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useUserStore } from "@/store/userStore";
import { base_url } from "./constants";
import { handleApiError } from "@/lib/middleware";

export async function createProfile(
  data: OnboardingData,
  router: AppRouterInstance,
  setLoading: (bool: boolean) => void
) {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("No access token found in localStorage");
      return;
    }

    const response = await fetch(`${base_url}/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      setLoading(false);
      return;
    }

    // ✅ Success toast
    toast.success("Profile created successfully");

    // ✅ Clear onboarding store
    const onboardingStore = useOnboardingStore.getState();
    router.push("/dashboard");
    onboardingStore.reset();

    return JSON.parse(text);
  } catch (error) {
    setLoading(false);
    console.error("Error creating profile:", error);
    toast.error("Failed to create profile");
    return;
  }
}

export const getProfile = async () => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("No access token found in localStorage");
      return;
    }

    const response = await fetch(`${base_url}/auth/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data: UserProfile = await response.json();
    console.log(data);
    useUserStore.getState().setUser(data);

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      return;
    }
  } catch (error) {
    console.error("Error creating profile:", error);
    toast.error("Failed to create profile");
    return;
  }
};
type GetMatchingProfileResult =
  | Founder
  | { profileExists: false; message: string };

export const getMatchingProfile = async (): Promise<
  GetMatchingProfileResult | undefined
> => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("No access token found in localStorage");
      return;
    }

    const response = await fetch(`${base_url}/profiles/me`, {
      method: "GET",
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
    const data: Founder = await response.json();
    return data;
  } catch (error) {
    // setLoading(false);
    console.error("Error getting profile profile:", error);
    toast.error("Failed to get profile");
    return;
  } finally {
    // setLoading(false);
  }
};

export const getSpecificProfile = async (
  id: string,
  router: AppRouterInstance
) => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("No access token found in localStorage");
      return;
    }

    const response = await fetch(`${base_url}/users/${id}`, {
      method: "GET",
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
    const data: Founder = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error creating profile:", error);
    toast.error("Failed to create profile");
    return;
  }
};
