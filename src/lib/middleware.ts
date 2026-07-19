import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";

export const handleApiError = (
  response: {
    message: string;
    error: string;
    statusCode: number;
  },
  router?: AppRouterInstance
) => {
  switch (response.statusCode) {
    case 400:
      toast.error(response.message || "Bad Request. Please try again.");
      break;
    case 401:
      toast.error(response.message || "Unauthorized. Please log in again.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      if (router) router.push("/");
      break;
    case 403:
      toast.error(
        response.message ||
          "Forbidden. You don’t have permission to perform this action."
      );
      break;
    case 404:
      toast.error(
        response.message || "Resource not found. Please try again later."
      );
      break;
    case 409:
      toast.error(response.message || "User profile already exists.");
      break;
    case 422:
      toast.error(
        response.message || "Invalid data. Please review your inputs."
      );
      break;
    case 429:
      toast.error(
        response.message || "Too many requests. Please wait a moment and try again."
      );
      break;
    case 500:
      toast.error(response.message || "Server error. Please try again later.");
      break;
    default:
      toast.error(
        `Unexpected error (${response.statusCode}). Please try again later.`
      );
  }
};

// Reads a rate-limit header by base name, falling back to any header that
// starts with it (covers the suffixed OTP variants, e.g. X-RateLimit-Remaining-otp).
function findRateLimitHeader(
  headerEntries: [string, string][],
  base: string
): string | null {
  const lowerBase = base.toLowerCase();
  const exact = headerEntries.find(([key]) => key.toLowerCase() === lowerBase);
  if (exact) return exact[1];
  const prefixed = headerEntries.find(([key]) =>
    key.toLowerCase().startsWith(lowerBase)
  );
  return prefixed ? prefixed[1] : null;
}

// Avoid re-warning on every request while quota stays low — only warn again
// once the remaining count actually changes.
let lastWarnedRemaining: number | null = null;

/**
 * Inspects rate-limit headers and surfaces a toast when quota is running low
 * or a request was rate-limited. Works off a plain [key, value][] list so it
 * can be fed from either a fetch Response or an axios response.
 */
function checkRateLimitHeaders(
  status: number,
  headerEntries: [string, string][]
) {
  const retryAfter = findRateLimitHeader(headerEntries, "Retry-After");

  if (status === 429) {
    const retryAfterMs = parseInt(retryAfter || "60000", 10);
    const seconds = Math.max(1, Math.ceil(retryAfterMs / 1000));
    toast.error(`Too many requests. Please wait ${seconds}s and try again.`);
    lastWarnedRemaining = null;
    return;
  }

  const remaining = parseInt(
    findRateLimitHeader(headerEntries, "X-RateLimit-Remaining") || "",
    10
  );
  const limit = parseInt(
    findRateLimitHeader(headerEntries, "X-RateLimit-Limit") || "",
    10
  );

  if (isNaN(remaining) || isNaN(limit) || limit <= 0) return;

  if (remaining <= Math.ceil(limit * 0.2) && remaining !== lastWarnedRemaining) {
    lastWarnedRemaining = remaining;
    toast(`Getting close to the request limit (${remaining}/${limit} left).`, {
      icon: "⚠️",
    });
  } else if (remaining > Math.ceil(limit * 0.2)) {
    lastWarnedRemaining = null;
  }
}

/** Use with a fetch() Response. */
export function checkRateLimit(response: Response) {
  checkRateLimitHeaders(response.status, Array.from(response.headers.entries()));
}

/** Use with an axios response's `.status` and `.headers` (plain object). */
export function checkRateLimitAxios(
  status: number,
  headers: Record<string, string>
) {
  checkRateLimitHeaders(status, Object.entries(headers || {}));
}
