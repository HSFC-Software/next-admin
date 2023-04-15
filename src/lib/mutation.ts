import { useMutation } from "react-query";
import { newVip, NewVipPayload } from "./api";

export const useNewVip = () => {
  // const queryClient = useQueryClient();

  return useMutation((payload: NewVipPayload) => newVip(payload), {
    onSuccess: () => {
      // queryClient.invalidateQueries(["getSubNetworks", { id: network_id }]);
    },
  });
};
