import { useSyncExternalStore } from "react";
import CryptoJS from "crypto-js";

type Callback = () => void;
const subscribers = new Map<symbol, Set<Callback>>();

interface SignalOptions<T> {
  persistKey?: string;
  encrypted?: boolean;
  secret?: string;
}

// Default secret known only inside the package (for ease-of-use)
const DEFAULT_SECRET = "__signal_package_secret__";

// Encrypt using AES
function encrypt<T>(data: T, secret: string): string {
  const json = JSON.stringify(data);
  return CryptoJS.AES.encrypt(json, secret).toString();
}

// Decrypt AES payload
function decrypt<T>(cipher: string, secret: string): T {
  const bytes = CryptoJS.AES.decrypt(cipher, secret);
  const json = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(json);
}

export function createSignal<T>(initialValue: T, options: SignalOptions<T> = {}) {
  let value: T = initialValue;
  const key = Symbol("signal");
  subscribers.set(key, new Set());

  const { persistKey, encrypted = false, secret = DEFAULT_SECRET } = options;

  // Try loading from localStorage if persistence is enabled
  if (persistKey && typeof localStorage !== "undefined") {
    const raw = localStorage.getItem(persistKey);
    if (raw) {
      try {
        value = encrypted ? decrypt<T>(raw, secret) : JSON.parse(raw);
      } catch (err) {
        console.warn(`[createSignal] Failed to load persisted value:`, err);
      }
    }
  }

  const get = () => value;

  const set = (newValueOrUpdater: T | ((prev: T) => T)) => {
    const newValue =
      typeof newValueOrUpdater === "function"
        ? (newValueOrUpdater as (prev: T) => T)(value)
        : newValueOrUpdater;

    if (newValue !== value) {
      value = newValue;

      // Save to localStorage if enabled
      if (persistKey && typeof localStorage !== "undefined") {
        try {
          const toStore = encrypted
            ? encrypt<T>(value, secret)
            : JSON.stringify(value);
          localStorage.setItem(persistKey, toStore);
        } catch (err) {
          console.warn(`[createSignal] Failed to persist value:`, err);
        }
      }

      subscribers.get(key)?.forEach((cb) => cb());
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
