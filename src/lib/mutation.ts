import { useMutation, useQueryClient } from "react-query";
import {
  assignConsolidator,
  AssignConsolidatorType,
  newVip,
  NewVipPayload,
  signIn,
  updateConsolidator,
  UpdateConsolidatorPayload,
} from "./api";
import { sendBulkSms } from "@/lib/api";

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

export const useSendBulkSms = () => {
  return useMutation<
    unknown,
    unknown,
    { text: string; receivers: string[]; sender: string }
  >(({ text, receivers, sender }) => sendBulkSms(text, receivers, sender));
};

export const useAssignConsolidator = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: AssignConsolidatorType) => assignConsolidator(payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getConsolidators", { q: "" }]);
        queryClient.invalidateQueries(["getVips", { status: "PENDING" }]);
      },
    }
  );
};

export const useUpdateConsolidator = (id: string, q?: string) => {
  const queryClient = useQueryClient();

  return useMutation(
    (payload: UpdateConsolidatorPayload) => updateConsolidator(id, payload),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["getConsolidators", { q }]);
      },
    }
  );
};
