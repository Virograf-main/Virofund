// import { authenticateUser } from "./auth";
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
  // setPrevuser: (bool: boolean) => void,
  isRegistering: boolean,
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
    const data = await authenticateUser({ email, isRegistering: isRegistering }, url);

    if (!data) return; // API failed, stop
    if (data.message !== "OTP sent") {
      toast.error(data.message || "Failed to send OTP");
      return;
    }
    toast.success("OTP sent to email. Please check your inbox.");
    openOtpModal?.();
    // setPrevuser(true); // switch back to login after signup
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

    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);

    toast.success("Account created successfully");
    setIsPrevUser(true); // switch to login after successful signup
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
  router: AppRouterInstance, // 👈 pass in next/router or useRouter from your component
) => {
  e.preventDefault();

  if (!email) return toast.error("Enter email");
  if (!password) return toast.error("Enter password");

  setIsLoggingIn(true);

  try {
    const url = `${base_url}/auth/login`;
    const data = await authenticateUser({ email, password }, url);

    if (!data) return;

    // Save token
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);

    toast.success("Logged in successfully");

    // ✅ Route depending on onboarded state
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

/**
 * Checks if a JWT access token is still valid
 * @param token - the JWT string
 * @returns true if valid, false if expired or invalid
 */
export function isAccessTokenValid(token: string | null): boolean {
  if (!token) return false;

  try {
    // JWTs are base64-encoded: header.payload.signature
    const payload = JSON.parse(atob(token.split(".")[1]));

    const now = Math.floor(Date.now() / 1000); // current time in seconds
    return payload.exp && payload.exp > now;
  } catch (e) {
    console.error("Failed to parse token:", e);
    return false;
  }
}

/**
 * Refreshes the access token once it is expired
 * @param token - the JWT refresh token
 * @returns new access token and refresh token if the refresh token is correct
 */

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
    localStorage.setItem("accessToken", data.access_token);
    localStorage.setItem("refreshToken", data.refresh_token);
  } catch (err) {
    console.log("error getting access token: ", err);
  }
}

export const handleForgotPasswordOtp = async (
  e: React.FormEvent<HTMLFormElement>,
  setIsLoading: (bool: boolean) => void,
  email: string,
  openOtpModal?: () => void,
) => {
  e.preventDefault();

  if (!email) return toast.error("Enter email");

  setIsLoading(true);

  try {
    const url = `${base_url}/auth/otp/send`;
    localStorage.setItem("resetEmail", email); // 👈 add this

    const data = await authenticateUser({ email, isRegistering: false }, url);

    if (!data) return;
    if (data.message !== "OTP sent") {
      toast.error(data.message || "Failed to send OTP");
      return;
    }

    toast.success("OTP sent to email. Please check your inbox.");
    openOtpModal?.();
  } catch (err: unknown) {
    toast.error((err as Error).message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

export const handleResetPassword = async (
  otp: string,
  newPassword: string,
  onSuccess?: () => void,
): Promise<void> => {
  if (!otp) { toast.error("Enter OTP"); return; }
  if (!newPassword) { toast.error("Enter new password"); return; }

  try {
    const email = localStorage.getItem("resetEmail");
    if (!email) { toast.error("Session expired, please try again"); return; }

    // Step 1: Verify OTP (GET with body)
    const verifyRes = await fetch(`${base_url}/auth/otp/verify`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const verifyData = await verifyRes.json();

    if (!verifyRes.ok) {
      toast.error(verifyData.message || "Invalid OTP");
      return;
    }

    // Step 2: Update password (PATCH)
    const updateRes = await fetch(`${base_url}/auth/password/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: newPassword }),
    });

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      toast.error(updateData.message || "Failed to update password");
      return;
    }

    toast.success("Password reset successfully");
    localStorage.removeItem("resetEmail");
    onSuccess?.();
  } catch (err: unknown) {
    toast.error((err as Error).message || "Failed to reset password");
  }
};

export const resendForgotPasswordOtp = async () => {
  try {
    const email = localStorage.getItem("resetEmail");
    if (!email) {
      toast.error("Session expired, please try again");
      return;
    }

    const url = `${base_url}/auth/otp/send`;
    const data = await authenticateUser({ email, isRegistering: false }, url);

    if (!data) return;

    toast.success("OTP resent successfully");
  } catch (err: unknown) {
    toast.error((err as Error).message || "Failed to resend OTP");
  }
};

export const handleLogout = async (router: AppRouterInstance) => {
  try {
    const accessToken = localStorage.getItem("accessToken");

    await fetch(`${base_url}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    // always clear and redirect regardless of API success
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("pendingUser");
    localStorage.removeItem("resetEmail");
    router.push("/");
  }
};

// export async function refreshToken() {
//   const refreshToken = localStorage.getItem("refreshToken");
//   if (!refreshToken) throw new Error("No refresh token");

//   const response = await fetch(`${base_url}/auth/refresh`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ refreshToken }),
//   });

//   if (!response.ok) {
//     throw new Error("Refresh failed");
//   }

//   const data = await response.json();

//   localStorage.setItem("accessToken", data.access_token);
//   localStorage.setItem("refreshToken", data.refresh_token);
// }
