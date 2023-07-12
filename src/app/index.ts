import createComponent from "@/lib/bit";
import Worker from "./Worker";
import State from "./State";
import { createContext } from "react";
import { UNSAFE_registerProperty } from "@/lib/global";

export const Context = createContext({});

export default createComponent({
  Worker,
  State,
  ReactContext: Context,
  useRef: (reference: any) => {
    UNSAFE_registerProperty("__BIT_STORE__", reference.store);
  },
});
