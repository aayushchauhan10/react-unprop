import { useSyncExternalStore } from "react";
import CryptoJS from "crypto-js";

type Callback = () => void;
const subscribers = new Map<symbol, Set<Callback>>();


const ENCRYPTION_SECRET = process.env.REACT_APP_ENCRYPTION_SECRET || "default_secret";

function encrypt(data: any): string {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_SECRET).toString();
}

function decrypt(encrypted: string): any {
  const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_SECRET);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
}

interface SignalOptions<T> {
  persistKey?: string; 
}

export function createSignal<T>(initialValue: T, options: SignalOptions<T> = {}) {
  const key = Symbol("signal");
  subscribers.set(key, new Set());

  const { persistKey } = options;

  let value: T = initialValue;


  if (persistKey) {
    const stored = localStorage.getItem(persistKey);
    if (stored !== null) {
      try {
        value = decrypt(stored);
      } catch (e) {
        console.warn(`Failed to decrypt localStorage signal for key "${persistKey}"`, e);
      }
    }
  }

  const get = () => value;

  const set = (newValueOrUpdater: T | ((prev: T) => T)) => {
    const newValue = typeof newValueOrUpdater === "function"
      ? (newValueOrUpdater as (prev: T) => T)(value)
      : newValueOrUpdater;

    if (newValue !== value) {
      value = newValue;

      if (persistKey) {
        try {
          localStorage.setItem(persistKey, encrypt(value));
        } catch (e) {
          console.error(`Failed to persist encrypted signal`, e);
        }
      }

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
