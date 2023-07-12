import {FC, ReactNode, Context} from 'react';
import {UseQueryResult} from 'react-query';
import Store from './store';

export type Obj = {[key: string]: unknown};

export type GenericFunction = (...args: any[]) => any;

export type Actions = {
  [key: string]: GenericFunction;
};

export type ComponentProps = {
  children?: ReactNode;
};

export type WorkerProps<P> = {
  useActions: (actions: P) => null;
  setState: <I>(key: string, value: I) => I;
  getState: <I>(key: string) => I;
  useRegisterQuery: (key: string, query: () => UseQueryResult) => void;
};

export type Listeners = Map<any, any>;

export type IWorker<I> = FC<WorkerProps<I>>;

export type usePropsType = <I = undefined>(
  key: keyof I,
  context?: Context<any>,
) => any;

export type Params = {
  View?: FC<any>;
  Worker?: IWorker<any>;
  State?: Obj;
  children?: ReactNode;
  ReactContext?: Context<any>;
  storeRef?: unknown;
  useRef?: (reference: {
    store: Store;
    context: Context<any>;
    useProps: (key: string) => unknown;
    useActions: (actions: Actions) => null;
    getState: <I>(key: string) => I;
    setState: <I>(key: string, value: I) => I;
    useRegisterQuery: (key: string, query: () => UseQueryResult) => void;
  }) => void;
};

export type useActionType = <I>(context?: Context<any>) => I;
