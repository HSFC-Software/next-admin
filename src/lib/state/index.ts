import { Context } from "@/app";
import { UNSAFE_retrieveProperty } from "@/lib/global";
import Store from "@/lib/bit/store";
import { useProps } from "@/lib/bit";

// Use case: Outside React
export const getRootProps = (key: string) => {
  const store = UNSAFE_retrieveProperty<Store | null>("__BIT_STORE__");
  return store?.getState(key);
};

// Use case: Within React
export const useRootProps: <I = undefined>(key: string) => I = (
  key: string
) => {
  const props = useProps(key, Context);
  return props;
};
