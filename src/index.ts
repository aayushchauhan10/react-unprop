import { useSyncExternalStore } from "react";

type Callback = () => void;
const subscribers = new Map<symbol, Set<Callback>>();

export function createSignal<T>(initialValue: T) {
  let value = initialValue;
  const key = Symbol("signal");
  subscribers.set(key, new Set());

  const get = () => value;

  const set = (newValueOrUpdater: T | ((prev: T) => T)) => {
    const newValue = typeof newValueOrUpdater === "function"
      ? (newValueOrUpdater as (prev: T) => T)(value)
      : newValueOrUpdater;

    if (newValue !== value) {
      value = newValue;
      subscribers.get(key)?.forEach(cb => cb());
    }
  };

  const subscribe = (cb: Callback) => {
    subscribers.get(key)?.add(cb);
    return () => {
      subscribers.get(key)?.delete(cb);
    };
  };

  return { get, set, subscribe };
}

export function useSignal<T>(signal: {
  get: () => T;
  subscribe: (cb: () => void) => () => void;
}): T {
  return useSyncExternalStore(signal.subscribe, signal.get);
}
