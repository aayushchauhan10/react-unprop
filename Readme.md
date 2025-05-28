# react-unprop

A tiny React signal system for reactive state sharing — no props, no context.

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
- 💙 **Supports both JavaScript and TypeScript**
- 📦 **Tiny bundle size** — less than 20KB gzipped
- 🚀 **Zero dependencies**

## 📦 Installation

Install using npm:

\`\`\`bash
npm install react-unprop
\`\`\`

or using yarn:

\`\`\`bash
yarn add react-unprop
\`\`\`

or using pnpm:

\`\`\`bash
pnpm add react-unprop
\`\`\`

## 🚀 Quick Start

Create and use react-unprops just like global `useState` — but better.

\`\`\`jsx
import { createSignal, useSignal } from "react-unprop";

const counter = createSignal(0);

function Counter() {
const count = useSignal(counter);
return <h1>{count}</h1>;
}

function IncrementButton() {
return <button onClick={() => counter.set(c => c + 1)}>Increment</button>;
}
\`\`\`

✅ Both components update automatically when the signal changes.

## 🧠 API Reference

### `createSignal(initialValue)`

Creates a reactive signal.

**Parameters:**

- `initialValue: T` — The initial value of the signal

**Returns an object with:**

- `get(): T` — returns current value
- `set(newValue | updaterFn): void` — sets value or updates with function
- `subscribe(callback): () => void` — used internally by useSignal

**Example:**

\`\`\`js
const user = createSignal({ name: "Alice" });

// Set with value
user.set({ name: "Bob", age: 25 });

// Set with updater function
user.set(prev => ({ ...prev, name: "Bob" }));

// Get current value
console.log(user.get()); // { name: "Bob", age: 25 }
\`\`\`

### `useSignal(signal)`

React hook that subscribes to a signal and auto-rerenders on update.

**Parameters:**

- `signal: Signal<T>` — The signal to subscribe to

**Returns:** The current value of the signal.

**Example:**

\`\`\`jsx
function Profile() {
const user = useSignal(userSignal);
return <div>Hello, {user.name}!</div>;
}
\`\`\`

## 🧪 Examples

### 🔢 Counter

\`\`\`jsx
import { createSignal, useSignal } from "react-unprop";

const counter = createSignal(0);

function App() {
const count = useSignal(counter);

return (

<div>
<h1>{count}</h1>
<button onClick={() => counter.set(c => c + 1)}>+</button>
<button onClick={() => counter.set(c => c - 1)}>-</button>
</div>
);
}
\`\`\`

### 👥 Shared Object State

\`\`\`jsx
const userSignal = createSignal({ name: "John", age: 25 });

function UserProfile() {
const user = useSignal(userSignal);
return <p>{user.name} - {user.age}</p>;
}

function AgeUpdater() {
return (
<button onClick={() =>
userSignal.set(u => ({ ...u, age: u.age + 1 }))
}>
Increment Age
</button>
);
}

function NameUpdater() {
return (
<input
onChange={(e) =>
userSignal.set(u => ({ ...u, name: e.target.value }))
}
placeholder="Enter name"
/>
);
}
\`\`\`

### 📝 Todo List (Arrays)

\`\`\`jsx
const todosSignal = createSignal([
{ id: 1, text: "Learn react-unprop", done: false }
]);

function TodoList() {
const todos = useSignal(todosSignal);

return (

<ul>
{todos.map(todo => (
<li key={todo.id}>
<input
type="checkbox"
checked={todo.done}
onChange={() =>
todosSignal.set(todos =>
todos.map(t =>
t.id === todo.id ? { ...t, done: !t.done } : t
)
)
}
/>
{todo.text}
</li>
))}
</ul>
);
}

function AddTodo() {
const addTodo = (text) => {
todosSignal.set(todos => [
...todos,
{ id: Date.now(), text, done: false }
]);
};

return (
<button onClick={() => addTodo("New todo")}>
Add Todo
</button>
);
}
\`\`\`

### 🎨 Theme System

\`\`\`jsx
const themeSignal = createSignal("light");

function ThemeProvider({ children }) {
const theme = useSignal(themeSignal);

return (

<div className={`theme-${theme}`}>
{children}
</div>
);
}

function ThemeToggle() {
const theme = useSignal(themeSignal);

return (
<button onClick={() =>
themeSignal.set(theme === "light" ? "dark" : "light")
}>
Switch to {theme === "light" ? "dark" : "light"} mode
</button>
);
}
\`\`\`

## 🧾 TypeScript Support

Unprops are fully typed and provide excellent TypeScript support:

\`\`\`ts
interface User {
name: string;
age: number;
email?: string;
}

const userSignal = createSignal<User>({
name: "Alice",
age: 22,
});

// TypeScript will enforce the User interface
userSignal.set(prev => ({
...prev,
age: prev.age + 1 // ✅ Valid
// invalidProp: true // ❌ TypeScript error
}));

function UserComponent() {
const user = useSignal(userSignal); // user is typed as User
return <div>{user.name}</div>; // ✅ TypeScript knows user.name exists
}
\`\`\`

## ❓ Why react-unprop?

### 🛠 Traditional React state management often needs:

- **Props drilling** — passing state through multiple component layers
- **Context Providers** — wrapping components and managing context
- **External state libraries** — Redux, Zustand, Jotai with their learning curves
- **Boilerplate code** — actions, reducers, selectors

### ✨ With react-unprop:

- **Global reactive state** without boilerplate
- **Minimal API surface** — just two functions
- **Works across unrelated components** — no provider needed
- **Automatic optimization** — components only re-render when their signals change
- **TypeScript-first** — built with TypeScript from the ground up

## 🔄 Migration Guide

### From useState

\`\`\`jsx
// Before
const [count, setCount] = useState(0);

// After
const countSignal = createSignal(0);
const count = useSignal(countSignal);
// Use countSignal.set() instead of setCount()
\`\`\`

### From Context

\`\`\`jsx
// Before
const ThemeContext = createContext();
const ThemeProvider = ({ children }) => {
const [theme, setTheme] = useState("light");
return (
<ThemeContext.Provider value={{ theme, setTheme }}>
{children}
</ThemeContext.Provider>
);
};

// After
const themeSignal = createSignal("light");
// No provider needed! Use useSignal(themeSignal) anywhere
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by signals in [SolidJS](https://www.solidjs.com/)
- Built for the React ecosystem
- Thanks to all contributors and users

---

**Made with ❤️ for the React community**

[Report Bug](https://github.com/aayushchauhan10/react-unprop/issues) · [Request Feature](https://github.com/aayushchauhan10/react-unprop/issues) · [Documentation](https://github.com/aayushchauhan10/react-unprop#readme)

