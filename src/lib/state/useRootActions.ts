import { UNSAFE_retrieveProperty } from "../global";
import Store from "@/lib/bit/store";
import { Actions } from "@/app/Worker";

export const useRootActions = (): Actions | null => {
  const store = UNSAFE_retrieveProperty<Store | null>("__BIT_STORE__");
  return store?.actions as Actions;
};

export default useRootActions;
