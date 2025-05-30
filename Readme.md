# react-unprop

A tiny, open-source React signal system for reactive state sharing — no props, no context.

Fast, flexible, and works across your entire React tree.

[![npm version](https://badge.fury.io/js/react-unprop.svg)](https://badge.fury.io/js/react-unprop)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

## ✨ Features

- ⚡ **Fast reactive updates** — re-renders only when signals change
- 🧼 **No props. No context.** Just unprops
- 🎯 **Auto re-render** on signal update
- 🔁 **Share state** between siblings, parents, or anywhere
- ✅ **Works with primitives, arrays, and objects**
- 🔐 **Optional encrypted persistence via localStorage**
- 🧩 **Encryption built-in** — no config needed
- 🧠 **Environment-agnostic** — works with CRA, Vite, Next.js, etc.
- 💙 **Supports both JavaScript and TypeScript**
- 📦 **Tiny bundle size** — less than 20KB gzipped
- 🚀 **Zero dependencies**
- 🌍 **Open Source** — built by the community, for the community

## 📦 Installation

Install using npm:

```bash
npm install react-unprop
```

or using yarn:

```bash
yarn add react-unprop
```

or using pnpm:

```bash
pnpm add react-unprop
```

## 🚀 Quick Start

Create and use react-unprops just like global `useState` — but better.

```jsx
import { createSignal, useSignal } from "react-unprop";

const counter = createSignal(0);

function Counter() {
  const count = useSignal(counter);
  return <h1>{count}</h1>;
}

function IncrementButton() {
  return <button onClick={() => counter.set((c) => c + 1)}>Increment</button>;
}
```

✅ Both components update automatically when the signal changes.

## 🔐 Persisting Encrypted State (Optional)

`react-unprop` allows optional persistence to localStorage with built-in AES encryption.

### Example

```js
const userSignal = createSignal({ name: "Alice" }, { persist: true });
```

The state will be securely stored in localStorage and automatically decrypted on load.

## 🧠 API Reference

### `createSignal(initialValue, options?)`

Creates a reactive signal.

**Parameters:**

- `initialValue: T` — The initial value of the signal
- `options.persist?: boolean` — Whether to persist the signal securely in localStorage

**Returns an object with:**

- `get(): T` — returns current value
- `set(newValue | updaterFn): void` — sets value or updates with function
- `subscribe(callback): () => void` — used internally by useSignal

### `useSignal(signal)`

React hook that subscribes to a signal and auto-rerenders on update.

**Parameters:**

- `signal: Signal<T>` — The signal to subscribe to

**Returns:** The current value of the signal.

## 🧪 Code Examples

### 🔢 Counter

```jsx
const counter = createSignal(0);

function App() {
  const count = useSignal(counter);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => counter.set((c) => c + 1)}>+</button>
      <button onClick={() => counter.set((c) => c - 1)}>-</button>
    </div>
  );
}
```

### 👥 Shared User State

```jsx
const userSignal = createSignal({ name: "John", age: 25 }, { persist: true });

function Profile() {
  const user = useSignal(userSignal);
  return (
    <div>
      {user.name}, {user.age}
    </div>
  );
}
```

### 📋 Dynamic List (Array)

```jsx
const itemsSignal = createSignal([]);

function AddItem() {
  return (
    <button
      onClick={() =>
        itemsSignal.set((prev) => [...prev, `Item ${prev.length + 1}`])
      }
    >
      Add Item
    </button>
  );
}

function ItemList() {
  const items = useSignal(itemsSignal);
  return (
    <ul>
      {items.map((item, idx) => (
        <li key={idx}>{item}</li>
      ))}
    </ul>
  );
}
```

### 🔄 Toggle State (Boolean)

```jsx
const darkModeSignal = createSignal(false);

function ToggleDarkMode() {
  const darkMode = useSignal(darkModeSignal);
  return (
    <button onClick={() => darkModeSignal.set(!darkMode)}>
      {darkMode ? "Disable" : "Enable"} Dark Mode
    </button>
  );
}
```

### 📝 Form Input Binding

```jsx
const formSignal = createSignal({ name: "", email: "" });

function Form() {
  const form = useSignal(formSignal);
  return (
    <form>
      <input
        value={form.name}
        onChange={(e) =>
          formSignal.set((f) => ({ ...f, name: e.target.value }))
        }
        placeholder="Name"
      />
      <input
        value={form.email}
        onChange={(e) =>
          formSignal.set((f) => ({ ...f, email: e.target.value }))
        }
        placeholder="Email"
      />
    </form>
  );
}
```

## 🔄 Migration Guide

### From useState

```jsx
// Before
const [count, setCount] = useState(0);

// After
const countSignal = createSignal(0);
const count = useSignal(countSignal);
```

### From Context

```jsx
// Before: Context
const ThemeContext = createContext();

// After: Signal
const themeSignal = createSignal("light");
```

## 🌟 Why Open Source?

- 👐 **Built with collaboration in mind**
- 🛠️ **Customizable and extensible**
- 🌱 **Actively maintained and open to PRs**
- 📣 **Community-driven roadmap**
- 🧩 **Transparent and secure codebase**

## 🤝 Contributing

We welcome all contributions! Whether it's improving docs, fixing bugs, or adding features — you're welcome to join the journey.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Made with ❤️ by Ayush Chauhan and the open-source community**

[Report Bug](https://github.com/aayushchauhan10/react-unprop/issues) · [Request Feature](https://github.com/aayushchauhan10/react-unprop/issues) · [Documentation](https://github.com/aayushchauhan10/react-unprop#readme)
