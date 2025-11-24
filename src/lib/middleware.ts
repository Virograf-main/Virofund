import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";

export const handleApiError = (
  response: Response,
  router?: AppRouterInstance
) => {
  switch (response.status) {
    case 400:
      toast.error("Bad request. Please check your inputs.");
      break;
    case 401:
      toast.error("Unauthorized. Please log in again.");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      if (router) router.push("/");
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
        `Unexpected error ${response.status}: ${response.statusText}`
      );
  }
};
