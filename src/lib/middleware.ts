import { error } from "console";
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
    case 500:
      toast.error(response.message || "Server error. Please try again later.");
      break;
    default:
      toast.error(
        `Unexpected error (${response.statusCode}). Please try again later.`
      );
  }
};
