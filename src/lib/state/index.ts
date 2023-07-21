import { Context } from "@/app";
import { UNSAFE_retrieveProperty } from "@/lib/global";
import Store from "@/lib/bit/store";
import { useProps } from "@/lib/bit";

type GenericFn = <I = undefined>(key: string) => I;

// Use case: Outside React
export const getRootProps: GenericFn = (key) => {
  const store = UNSAFE_retrieveProperty<Store | null>("__BIT_STORE__");
  console.log({ store });
  return store?.getState(key);
};

// Use case: Within React
export const useRootProps: <I = undefined>(key: string) => I = (
  key: string
) => {
  const props = useProps(key, Context);
  return props;
};
