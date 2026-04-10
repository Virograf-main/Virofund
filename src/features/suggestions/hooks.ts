import { useQuery } from "@tanstack/react-query";
import { generateMatch } from "./requests";
import { useUserStore } from "@/store/userStore";

export const useGenerateMatch = () => {
    const user = useUserStore().user
  return useQuery({
    queryKey: ["suggestions", "generate-match"],
    queryFn: generateMatch,
    refetchOnWindowFocus: false,
    enabled: !!user?.id
  });
};