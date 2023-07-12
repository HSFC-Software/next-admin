// import {View} from 'react-native';
import {
  ReactNode,
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
  Context as ReactContext,
} from "react";
import type {
  Obj,
  Params,
  ComponentProps,
  WorkerProps,
  Actions,
  usePropsType,
  useActionType,
} from "@/lib/bit";
import Store from "@/lib/bit/store";
import get from "lodash.get";
import { UseQueryResult } from "react-query";

export const Context = createContext<any>({});
export const useBitContext = (context?: ReactContext<any>) =>
  useContext(context || Context);

export const useProps: usePropsType = (key, context?: ReactContext<any>) => {
  const { useProps: _useProps } = useBitContext(context);
  return _useProps(key);
};

export const useActions: useActionType = (context?: ReactContext<any>) => {
  const { actions } = useBitContext(context);
  return actions;
};

export const useStore = (context?: ReactContext<any>) => {
  const { store } = useBitContext(context);
  return store as Store;
};

const createComponent = ({
  View: component,
  Worker: worker,
  State = {},
  ReactContext,
  useRef,
}: Params): any => {
  let Provider = Context;
  if (ReactContext) Provider = ReactContext;

  const store = new Store(State);

  const useProps = (key: string) => {
    const initialState = store.getState(key);
    const [state, setState] = useState(initialState);
    useEffect(() => {
      const handler = (state: Obj) => {
        setState(get(state, key));
      };
      store.subscribe(handler);
      return () => store.unsubscribe(handler);
    }, []);
    return state;
  };

  // worker props
  const useActions = (actions: Actions) => {
    Object.keys(actions).forEach((key) => {
      store.setAction(key, actions[key]);
    });

    return null;
  };

  // worker props
  const getState = (key: string): any => store.getState(key);

  // worker props
  const setState = (key: string, value: unknown): any =>
    store.setState(key, value);

  const useRegisterQuery = (key: string, query: () => UseQueryResult) => {
    const response = query();
    setState(key, response);
  };

  // bundler
  let _component: ReactNode = null;
  const Component = component as FC<ComponentProps>;
  if (component) _component = <Component />;

  let _worker: ReactNode = null;
  const Worker = worker as FC<WorkerProps<any>>;

  if (worker)
    _worker = (
      <div style={{ display: "none" }}>
        <Worker
          useActions={useActions}
          useRegisterQuery={useRegisterQuery}
          getState={getState}
          setState={setState}
        />
      </div>
    );

  const ConsumerProps: any = {
    useProps,
    actions: store.actions,
  };

  if (ReactContext) {
    ConsumerProps.store = store;
  }

  useRef?.({
    store,
    context: Provider,
    useProps,
    useActions,
    getState,
    setState,
    useRegisterQuery,
  });

  return ({ children }: { children?: ReactNode }) => {
    if (children) {
      if (component) _component = <Component>{children}</Component>;
      else _component = <>{children}</>;
    }

    return (
      <Provider.Provider value={ConsumerProps}>
        {_component}
        {_worker}
      </Provider.Provider>
    );
  };
};

export default createComponent;
export * from "./types";
