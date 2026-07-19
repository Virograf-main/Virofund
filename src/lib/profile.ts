import type { Founder, OnboardingData, UserProfile } from "@/types/userprofile";
import toast from "react-hot-toast";
import { useOnboardingStore } from "@/store/onboardingStore";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useUserStore } from "@/store/userStore";
import { base_url } from "./constants";
import { handleApiError, checkRateLimit } from "@/lib/middleware";

export async function createProfile(
  data: OnboardingData,
  router: AppRouterInstance,
  setLoading: (bool: boolean) => void
) {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    // Remove preference fields — they're set separately via updatePreferences
    const {
      preferredSkills: _ps,
      preferredFounderType: _pft,
      preferredIndustry: _pi,
      preferredCommitmentLevel: _pcl,
      preferredFinancial: _pf,
      preferredPersonalityTraits: _ppt,
      preferredLocation: _pl,
      ...profileData
    } = data;

    const response = await fetch(`${base_url}/profiles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    checkRateLimit(response);
    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      setLoading(false);
      return;
    }

    const result = await response.json();
    toast.success("Profile created successfully");
    // Flag to show one-time preferences prompt on next dashboard visit
    localStorage.setItem("showPreferencesPrompt", "true");
    const onboardingStore = useOnboardingStore.getState();
    router.push("/dashboard");
    onboardingStore.reset();
    return result;
  } catch (error) {
    setLoading(false);
    console.error("Error creating profile:", error);
    toast.error("Failed to create profile");
    return;
  }
}

export async function updateProfile(
  data: Partial<OnboardingData>,
  setLoading?: (bool: boolean) => void
) {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    const response = await fetch(`${base_url}/profiles/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    checkRateLimit(response);
    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      return;
    }

    const result = await response.json();
    toast.success("Profile updated successfully");
    return result;
  } catch (error) {
    console.error("Error updating profile:", error);
    toast.error("Failed to update profile");
    return;
  } finally {
    setLoading?.(false);
  }
}

export async function updatePreferences(
  data: {
    preferredSkills?: string[];
    preferredFounderType?: string;
    preferredIndustry?: string;
    preferredCommitmentLevel?: string;
    preferredFinancial?: string;
    preferredPersonalityTraits?: string[];
    preferredLocation?: string;
  }
) {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    const response = await fetch(`${base_url}/profiles/me/preferences`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    checkRateLimit(response);
    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      return;
    }

    const result = await response.json();
    toast.success("Preferences updated successfully");
    return result;
  } catch (error) {
    console.error("Error updating preferences:", error);
    toast.error("Failed to update preferences");
    return;
  }
}

export const getProfile = async (): Promise<UserProfile | undefined> => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    const response = await fetch(`${base_url}/profiles/me`, {
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
      return;
    }

    // The API returns a flat structure with firstName, lastName, + all profile fields
    // We map it to the nested UserProfile structure for store compatibility
    const flat = await response.json();
    const userProfile: UserProfile = {
      id: flat.userId,
      email: flat.email,
      firstName: flat.firstName,
      lastName: flat.lastName,
      isActive: true,
      isAdmin: false,
      createdAt: flat.createdAt,
      updatedAt: flat.updatedAt,
      profile: {
        id: flat.id,
        userName: flat.userName || "",
        bio: flat.bio || "",
        dateOfBirth: flat.dateOfBirth || "",
        gender: flat.gender || "",
        linkedInUrl: flat.linkedInUrl || "",
        founderStatus: flat.founderStatus || "",
        skills: flat.skills || [],
        industry: flat.industry || "",
        currentOccupation: flat.currentOccupation || "",
        yearsExperience: flat.yearsExperience || 0,
        commitmentLevel: flat.commitmentLevel || "",
        financialContribution: flat.financialContribution || "",
        personalityTraits: flat.personalityTraits || [],
        location: flat.location || "",
        workStyle: flat.workStyle || "",
        hasStartup: flat.hasStartup || false,
        riskManagementStyle: flat.riskManagementStyle || "",
        pastExperience: flat.pastExperience || "",
        preferredSkills: flat.preferredSkills || [],
        preferredFounderType: flat.preferredFounderType || "",
        preferredIndustry: flat.preferredIndustry || "",
        preferredCommitmentLevel: flat.preferredCommitmentLevel || "",
        preferredFinancial: flat.preferredFinancial || "",
        preferredPersonalityTraits: flat.preferredPersonalityTraits || [],
        preferredLocation: flat.preferredLocation || "",
        createdAt: flat.createdAt,
        updatedAt: flat.updatedAt,
      },
    };

    useUserStore.getState().setUser(userProfile);
    return userProfile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    toast.error("Failed to fetch profile");
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
      return;
    }

    const response = await fetch(`${base_url}/profiles/me`, {
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
      return;
    }
    const data: Founder = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting profile:", error);
    toast.error("Failed to get profile");
    return;
  }
};

export const checkProfileExists = async (): Promise<boolean | undefined> => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    const response = await fetch(`${base_url}/profiles/me/exists`, {
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
      return;
    }

    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Error checking profile:", error);
    toast.error("Failed to check profile");
    return;
  }
};

export const deleteProfile = async () => {
  try {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return;
    }

    const response = await fetch(`${base_url}/profiles/me`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    checkRateLimit(response);
    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      return;
    }

    toast.success("Profile deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting profile:", error);
    toast.error("Failed to delete profile");
    return;
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
      return;
    }

    const response = await fetch(`${base_url}/profiles/${id}`, {
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
      return;
    }
    const data: Founder = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting profile:", error);
    toast.error("Failed to get profile");
    return;
  }
};

/**
 * Generates (or returns the cached) AI compatibility summary between the
 * current user and the given profile. Cached server-side for 1 hour, so
 * repeat calls for the same pair are cheap.
 */
export const generateMatchSummary = async (
  profileId: string
): Promise<string | null> => {
  try {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    const response = await fetch(
      `${base_url}/profiles/me/match-summary/${profileId}`,
      {
        method: "POST",
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
      return null;
    }

    const data = await response.json();
    return data.summary ?? null;
  } catch (error) {
    console.error("Error generating match summary:", error);
    toast.error("Failed to generate match summary");
    return null;
  }
};
