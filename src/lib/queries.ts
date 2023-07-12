import { useQuery } from "react-query";
import { getConsolidators, getVips } from "./api";

export const useGetVips = (status?: "ASSIGNED" | "PENDING") => {
  return useQuery(["getVips", { status }], async () => await getVips(status), {
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
};

export const useGetConsolidators = () => {
  return useQuery(["getConsolidators"], async () => await getConsolidators(), {
    staleTime: 1000 * 60 * 5,
    enabled: true,
  });
};
