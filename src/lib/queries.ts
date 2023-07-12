import { useQuery } from "react-query";
import { getVips } from "./api";

export const useGetVips = (status?: "ASSIGNED" | "PENDING") => {
  return useQuery(["getVips", { status }], async () => await getVips(status), {
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
};
