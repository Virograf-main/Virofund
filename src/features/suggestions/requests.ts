import { instance } from "@/lib/axios"; // adjust path
import { suggestionsEndpoints } from "./endpoints";
import { FounderMatch } from "@/types/matches";
// import { SuggestionsResponse } from "./types";

export const generateMatch = async (): Promise<FounderMatch[]> => {
  const res = await instance.post(suggestionsEndpoints.generate_match);
  return res.data;
};