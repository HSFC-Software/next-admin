import { useMutation } from "react-query";
import { newVip, NewVipPayload, signIn } from "./api";

export const useNewVip = () => {
  // const queryClient = useQueryClient();

  return useMutation((payload: NewVipPayload) => newVip(payload), {
    onSuccess: () => {
      // queryClient.invalidateQueries(["getSubNetworks", { id: network_id }]);
    },
  });
};

export const useSignIn = () => {
  return useMutation<unknown, unknown, string>((token: string) =>
    signIn(token)
  );
};
