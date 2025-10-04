// import { authenticateUser } from "./auth";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { saveUserToFirebase, getUserFromFirebase } from "./firebase";
import toast from "react-hot-toast";
import { FirebaseUser } from "@/types/firebase";

export const authenticateUser = async (
  payload: Record<string, string>,
  url: string
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

export const handleSignUp = async (
  e: React.FormEvent<HTMLFormElement>,
  setIsCreatingAccount: (bool: boolean) => void,
  isChecked: boolean,
  password: string,
  firstName: string,
  lastName: string,
  email: string,
  setPrevuser: (bool: boolean) => void
) => {
  e.preventDefault();

  if (!isChecked) return toast.error("Please agree to the terms");
  if (!firstName || !lastName) return toast.error("Enter first and last name");
  if (!email) return toast.error("Enter email ");

  setIsCreatingAccount(true);

  try {
    const url = "http://localhost:4000/auth/register";
    const data = await authenticateUser(
      { firstName, lastName, email, password },
      url
    );

    if (!data) return; // API failed, stop

    // Save to Firebase after backend success
    await saveUserToFirebase({ firstName, lastName, email });

    toast.success("Account created successfully");
    setPrevuser(true); // switch back to login after signup
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Something went wrong");
  } finally {
    setIsCreatingAccount(false);
  }
};

export const handleLogin = async (
  e: React.FormEvent<HTMLFormElement>,
  setIsLoggingIn: (bool: boolean) => void,
  email: string,
  password: string,
  router: AppRouterInstance // 👈 pass in next/router or useRouter from your component
) => {
  e.preventDefault();

  if (!email) return toast.error("Enter email");
  if (!password) return toast.error("Enter password");

  setIsLoggingIn(true);

  try {
    // Check Firebase user first
    const firebaseUser: FirebaseUser | null = await getUserFromFirebase(email);
    if (!firebaseUser) {
      toast.error("User not found");
      setIsLoggingIn(false);
      return;
    }

    const url = "http://localhost:4000/auth/login";
    const data = await authenticateUser({ email, password }, url);

    if (!data) return; // API failed, stop

    // Save token
    localStorage.setItem("accessToken", data.accessToken);

    toast.success("Logged in successfully");
    console.log("Login success:", data);

    // ✅ Route depending on onboarded state
    if (firebaseUser.isOnboarded) {
      router.push("/dashboard");
    } else {
      router.push("/welcome");
    }

    return data;
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Login failed");
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
