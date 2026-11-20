# JavaScript Preparation Hub (Advanced Concepts & MNC Interview Masterclass)

An interactive, production-ready study and interview preparation application designed to help transition from basic JavaScript to advanced/senior mastery, with a dedicated MNC interview vault and a live interactive code playground.

---

## 🚀 How to Run the App

### Option 1: Using Node.js (Recommended)
Open your terminal inside this `JS` folder and run:
```bash
npm start
```
or
```bash
node server.js
```
Then open your browser at **`http://localhost:3000`**.

### Option 2: Direct File Open
You can also open `index.html` directly in any modern browser (Chrome, Edge, Safari, Firefox). Note: Because ES Modules (`type="module"`) are used, running via `npm start` is recommended to avoid local CORS file protocol restrictions.

---

## 📚 What's Included in the App

### 1. 📘 Advanced JavaScript Masterclass
Deep-dive conceptual breakdowns with formal syntax, exact return types, parameters, mutability, execution mechanics, and common traps:
* **Execution Context & Call Stack**: Memory creation phase vs execution phase, hoisting, TDZ.
* **Closures & Lexical Scoping**: Data encapsulation, function factories, memory leak prevention.
* **The `this` Keyword (4-Rule Resolution System)**: Default, implicit, explicit (`call`/`apply`/`bind`), `new` binding, and arrow functions.
* **Prototypes & Prototypal Inheritance**: `prototype` vs `__proto__`, prototype chain lookup, ES6 classes vs prototypal delegation, private `#fields`.
* **Event Loop & Concurrency**: Call stack, Web APIs, Microtasks (Promises, `queueMicrotask`) vs Macrotasks (`setTimeout`), event loop starvation.
* **Promises & Combinators**: In-depth lifecycle, `.then()/.catch()/.finally()`, and all 4 combinators (`Promise.all`, `Promise.allSettled`, `Promise.race`, `Promise.any`).
* **Advanced Array Methods**: Complete breakdown of `.map`, `.filter`, `.reduce`, `.flatMap`, and modern ES2023 non-mutating methods (`.toSorted`, `.toReversed`, `.toSpliced`, `.with`).
* **Generators & Iterators**: Iterable and Iterator protocols, `Symbol.iterator`, `function*`, `yield`, `yield*`, infinite sequences.
* **Proxy & Reflect**: Metaprogramming, traps (`get`, `set`), and building reactive state systems (like Vue 3).
* **Memory Management & Garbage Collection**: Mark-and-sweep, young/old generation, avoiding memory leaks, and `WeakMap` / `WeakSet`.
* **Currying & Function Composition**: Partial application, `pipe()`, `compose()`, higher-order functions.

### 2. 💼 MNC Interview Vault
Separated interview section with questions asked by top product and IT services MNCs (**Google, Amazon, Microsoft, Meta, TCS, Infosys, Cognizant, Wipro, Accenture, Capgemini, HCL**):
* **Tricky Output-Based Questions**:
  - `var` vs `let` in `setTimeout` loop (and IIFE solution)
  - Microtasks vs Macrotasks execution order
  - Arrow function `this` inside objects vs nested functions
  - Type coercion enigmas (`[] + []`, `{} + []`, `0.1 + 0.2 === 0.3`, `typeof null`, `NaN === NaN`)
* **Polyfill Implementations**:
  - `Array.prototype.myMap`, `myFilter`, `myReduce` (handling sparse arrays, `thisArg`, empty arrays)
  - `Function.prototype.myBind` (supporting currying and `new` constructor behavior)
  - `Promise.myAll` and `Promise.myAllSettled`
  - `Array.prototype.myFlat` with custom depth
* **Architecture & Theory**:
  - Debounce vs Throttle (with production code)
  - Deep Copy vs Shallow Copy & why `JSON.parse(JSON.stringify())` fails in production
  - Event Propagation (Bubbling, Capturing, Event Delegation)
* **Machine Coding / Algorithms**:
  - `deepClone(obj)` handling circular graphs, Dates, RegExps, Symbols
  - Flatten deeply nested object with dot notation
  - Custom `EventEmitter` (`on`, `emit`, `off`, `once`)
  - LRU (Least Recently Used) Cache with $O(1)$ operations

### 3. ⚡ Syntax & Return Types Matrix
A quick-reference cheatsheet comparing arguments, exact return types (`Promise<T>`, `T[]`, `boolean`, `any`), and mutability status across essential JavaScript methods.

### 4. 🧪 Live JavaScript Playground & Console
* Built-in code runner drawer that intercepts `console.log`, `warn`, `error`, and inspects return values.
* Click **"Try in Playground"** on any topic or interview question to immediately load and execute the code.
* Keyboard shortcut: `Cmd/Ctrl + Enter` to run code instantly.

### 5. 🎯 Progress Tracking & Bookmarks
* Mark questions or topics as **Mastered (✓)** to update your progress bar.
* **Bookmark (⭐)** questions for quick review.
* All progress is persisted locally in your browser (`localStorage`).

---

## 🛠️ How to Add New Questions or Topics Over Time

The project is structured modularly so you can add new questions anytime:

### To add a new Advanced Concept:
Open `data/topics.js` and add an object to `ADVANCED_TOPICS`:
```javascript
{
  id: "unique-topic-id",
  category: "Core Engine & Scope", // or "Objects & Prototypes", etc.
  difficulty: "Advanced",
  title: "Topic Title",
  summary: "Brief explanation",
  syntax: "Method.syntax(arg)",
  returnType: "Expected Return Type",
  mutates: "Yes / No",
  keyConcepts: [
    "Key point 1",
    "Key point 2"
  ],
  codeExample: `// Code to demonstrate...`,
  engineUnderTheHood: "How V8 handles this...",
  commonPitfalls: "What candidates get wrong..."
}
```

### To add a new MNC Interview Question:
Open `data/interview.js` and add an object to `INTERVIEW_QUESTIONS`:
```javascript
{
  id: "unique-q-id",
  type: "output", // 'output' | 'polyfill' | 'concept' | 'coding'
  difficulty: "Medium", // 'Easy' | 'Medium' | 'Hard'
  companies: ["Amazon", "TCS", "Google"],
  title: "Question Title",
  question: "The prompt asked in interview...",
  codeSnippet: `// Problem code...`,
  answer: `Detailed explanation and step-by-step reasoning...`,
  runnableCode: `// Code that runs in playground...`,
  interviewerTip: "What senior interviewers look for..."
}
```
Refresh the browser, and your new topics will immediately appear with search, filtering, and live playground support!
