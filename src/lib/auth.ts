import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";
import { base_url } from "@/lib/constants";
import { getMatchingProfile } from "@/lib/profile";
import { handleApiError } from "@/lib/middleware";

export const authenticateUser = async (
  payload: Record<string, string | boolean>,
  url: string,
) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Something went wrong");
      return null;
    }

    return data;
  } catch (err) {
    console.error("API request failed:", err);
    toast.error("Something went wrong");
    return null;
  }
};

export const handleSendOtp = async (
  e: React.FormEvent<HTMLFormElement>,
  setIsCreatingAccount: (bool: boolean) => void,
  isChecked: boolean,
  password: string,
  firstName: string,
  lastName: string,
  email: string,
  openOtpModal?: () => void,
) => {
  e.preventDefault();

  if (!isChecked) return toast.error("Please agree to the terms");
  if (!firstName || !lastName) return toast.error("Enter first and last name");
  if (!email) return toast.error("Enter email ");

  setIsCreatingAccount(true);

  try {
    const url = `${base_url}/auth/otp/send`;
    localStorage.setItem(
      "pendingUser",
      JSON.stringify({ firstName, lastName, password, email }),
    );
    const data = await authenticateUser({ email, isRegistering: true }, url);

    if (!data) return;
    toast.success("OTP sent to email. Please check your inbox.");
    openOtpModal?.();
  } catch (err: unknown) {
    console.error(err);
    toast.error((err as Error).message || "Something went wrong");
  } finally {
    setIsCreatingAccount(false);
  }
};

export const resendOtp = async () => {
  try {
    const pendingUserStr = localStorage.getItem("pendingUser");
    if (!pendingUserStr) {
      toast.error("No pending registration found");
      return;
    }

    const { email } = JSON.parse(pendingUserStr);

    const url = `${base_url}/auth/otp/send`;
    const data = await authenticateUser({ email, isRegistering: true }, url);

    if (!data) return;

    toast.success("OTP resent successfully");
  } catch (err: unknown) {
    toast.error((err as Error).message || "Failed to resend OTP");
  }
};

export const handleSignUp = async (
  otp: string,
  setIsPrevUser: (bool: boolean) => void,
): Promise<void> => {
  if (!otp) {
    toast.error("Enter OTP");
    return;
  }

  try {
    const url = `${base_url}/auth/register`;

    const pendingUserStr = localStorage.getItem("pendingUser");
    if (!pendingUserStr) {
      toast.error("No pending registration found");
      return;
    }

    const pendingUser = JSON.parse(pendingUserStr);

    const data = await authenticateUser({ ...pendingUser, otp }, url);

    if (!data) return;

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    toast.success("Account created successfully");
    setIsPrevUser(true);
    localStorage.removeItem("pendingUser");
  } catch (err: unknown) {
    console.error(err);
    toast.error((err as Error).message || "Failed to verify OTP");
  }
};

export const handleLogin = async (
  e: React.FormEvent<HTMLFormElement>,
  setIsLoggingIn: (bool: boolean) => void,
  email: string,
  password: string,
  router: AppRouterInstance,
) => {
  e.preventDefault();

  if (!email) return toast.error("Enter email");
  if (!password) return toast.error("Enter password");

  setIsLoggingIn(true);

  try {
    const url = `${base_url}/auth/login`;
    const data = await authenticateUser({ email, password }, url);

    if (!data) return;

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    toast.success("Logged in successfully");

    const profile = await getMatchingProfile();
    console.log(profile);

    if (!profile) {
      router.push("/welcome");
      return;
    }

    if ("profileExists" in profile && profile.profileExists === false) {
      router.push("/welcome");
      return;
    }
    router.push("/dashboard");

    return data;
  } catch (err: unknown) {
    console.error(err);
    toast.error((err as Error).message || "Login failed");
  } finally {
    setIsLoggingIn(false);
  }
};

export function isAccessTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > now;
  } catch (e) {
    console.error("Failed to parse token:", e);
    return false;
  }
}

export async function refreshToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return;

  try {
    const url = `${base_url}/auth/refresh`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      const error = await response.json();
      handleApiError(error);
      return;
    }
    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
  } catch (err) {
    console.log("error getting access token: ", err);
  }
}
