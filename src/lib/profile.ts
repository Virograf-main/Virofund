import type { OnboardingData } from "@/types/userprofile";
import toast from "react-hot-toast";
import { useOnboardingStore } from "@/store/onboardingStore"; // adjust path if needed
import { getUserFromFirebase } from "./firebase";
import { markUserOnboarded } from "./firebase"; // new function
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function createProfile(
  data: OnboardingData,
  router: AppRouterInstance,
  setLoading: (bool: boolean) => void
) {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("No access token found in localStorage");
      return;
    }

    const response = await fetch("http://localhost:4000/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();

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
            `Unexpected error ${response.status}: ${
              text || response.statusText
            }`
          );
      }
      setLoading(false);
      return;
    }

    // ✅ Success toast
    toast.success("Profile created successfully");

    // ✅ Mark Firebase user as onboarded
    const firebaseUser = localStorage.getItem("userId")
      ? await getUserFromFirebase(localStorage.getItem("email")!)
      : null;
    if (firebaseUser) {
      await markUserOnboarded(firebaseUser.id);
    }

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
