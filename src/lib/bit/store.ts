import type { Obj, Listeners, Actions, GenericFunction } from "@/lib/bit";
import get from "lodash.get";
import set from "lodash.set";

export default class Store {
  public state: Obj;
  public listeners: Listeners = new Map();
  public actions: Actions = {};

  constructor(state: Obj) {
    this.state = state;
  }

  getState<I>(key: string): I {
    return get(this.state, key) as I;
  }

  setState(key: string, value: any) {
    this.state = set(this.state, key, value);

    this.listeners.forEach((handler) => {
      handler(this.state);
    });
  }

  setAction(key: string, callback: GenericFunction) {
    this.actions[key] = callback;
  }

  subscribe(handler: (state: Obj) => void) {
    this.listeners.set(handler, handler);
  }

  unsubscribe(handler: (state: Obj) => void) {
    this.listeners.delete(handler);
  }
}
