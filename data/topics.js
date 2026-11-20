/**
 * Advanced JavaScript Deep-Dive Curriculum
 * Complete set of all topics with:
 * - Simple Beginner Example vs Real-World Advanced Example
 * - Plain English Concept Clarifiers (What is TDZ, Lexical Scope, Hoisting, etc.)
 * - Line-by-Line Code Walkthrough
 * - Syntax, Parameters, Return Types & Mutability
 */

export const ADVANCED_TOPICS = [
  {
    id: "execution-context",
    category: "Core Engine & Scope",
    difficulty: "Advanced",
    title: "Execution Context, Call Stack & Temporal Dead Zone (TDZ)",
    simpleExplanation: "Before JavaScript runs even 1 line of your code, it does a 'Preparation Pass' (Creation Phase) where it allocates memory for your variables. If you use 'var', it gives it a temporary value of undefined. But if you use 'let' or 'const', it reserves the name but forbids you from touching it until its line is reached. That forbidden zone is called the Temporal Dead Zone (TDZ).",
    summary: "How the V8 JavaScript engine executes code behind the scenes across the Creation and Execution phases.",
    syntax: "// Internal Engine Structure\nExecutionContext = {\n  VariableEnvironment: { varDeclarations, functionDeclarations },\n  LexicalEnvironment: { letDeclarations, constDeclarations, outerEnvRef },\n  ThisBinding: <window | global | undefined>\n};",
    returnType: "N/A (Engine Internal Lifecycle)",
    mutates: "N/A",
    conceptClarifiers: [
      {
        term: "What is the Temporal Dead Zone (TDZ)?",
        meaning: "Imagine booking a table at a restaurant for 7:00 PM. The table is reserved with your name (the engine knows the variable exists), but you are NOT allowed to sit down or touch the table until 7:00 PM arrives. If you try to access a 'let' or 'const' variable before its declaration line, JS throws a ReferenceError. That waiting time is the TDZ."
      },
      {
        term: "What is Hoisting?",
        meaning: "Hoisting is JavaScript's default behavior of moving declarations to the top of the current scope in memory during the Creation Phase. Function declarations are hoisted with their entire body, while 'var' is hoisted as undefined."
      },
      {
        term: "What is the Call Stack?",
        meaning: "Think of a vertical stack of dinner plates (Last-In, First-Out). When a function is called, a new plate (Execution Context) is placed on top. When the function returns, that plate is popped off. If you call functions in an infinite loop, the stack overflows (Stack Overflow error)."
      }
    ],
    simpleExample: `// 🟢 SIMPLE BEGINNER EXAMPLE
// 1. Trying to read 'var' before its line:
console.log(myVar); // logs: undefined (Hoisted!)
var myVar = 10;
console.log(myVar); // logs: 10

// 2. Trying to read 'let' before its line (TDZ Error):
// console.log(myLet); // ❌ Throws ReferenceError: Cannot access 'myLet' before initialization
let myLet = 20; // TDZ ends here!
console.log(myLet); // logs: 20`,
    codeExample: `// 🔵 REAL-WORLD ADVANCED EXAMPLE: Function Declaration vs Expression in Execution Context
// Step 1: Function declaration is fully hoisted - callable anywhere in scope!
greetUser("Alice"); // Output: "Hello, Alice!"

function greetUser(name) {
  console.log("Hello, " + name);
}

// Step 2: Function expression assigned to 'var'
// console.log(farewell); // undefined
// farewell("Bob"); // ❌ TypeError: farewell is not a function!

var farewell = function(name) {
  console.log("Goodbye, " + name);
};

farewell("Bob"); // Works now: "Goodbye, Bob"`,
    walkthrough: [
      "Line 1 (Creation Phase): Engine scans code. Function 'greetUser' is saved in memory with its full body. 'farewell' is initialized to undefined.",
      "Line 3 (Execution Phase): greetUser('Alice') runs immediately because its function body was already stored.",
      "Line 11: Attempting to call farewell() before line 14 throws 'TypeError: farewell is not a function' because its value is still undefined."
    ],
    engineUnderTheHood: "In V8, each Execution Context maintains a reference to its outer Lexical Environment. This outer reference is determined statically at compile time (Lexical Scope) based on where the function was authored in the source code, NOT where it is called.",
    commonPitfalls: "Relying on var hoisting leads to accidental undefined bugs. Calling function expressions before assignment causes 'TypeError: fn is not a function'."
  },

  {
    id: "closures-deep-dive",
    category: "Core Engine & Scope",
    difficulty: "Advanced",
    title: "Closures & Lexical Scoping",
    simpleExplanation: "A closure is when an inner function 'remembers' and keeps access to variables from its parent function, even after the parent function has completely finished running and returned.",
    summary: "A closure is a function bundled together with references to its surrounding lexical state, allowing it to remember and access outer variables even after the outer function has completed execution.",
    syntax: "function outer(param) {\n  const privateState = param;\n  return function inner(arg) {\n    return privateState + arg;\n  };\n}",
    returnType: "Function (Higher-Order Function returning an inner Function)",
    mutates: "No (unless inner function mutates enclosed reference)",
    conceptClarifiers: [
      {
        term: "What is Lexical Scope?",
        meaning: "'Lexical' means 'where it is written in code'. An inner function has access to variables defined in its outer parent because of how the code is written on the page, not where it is called."
      },
      {
        term: "Why does the variable stay alive?",
        meaning: "Normally, when a function finishes, its local variables are destroyed to free memory. But if an inner function still holds a reference to those variables, JavaScript keeps them alive in heap memory."
      }
    ],
    simpleExample: `// 🟢 SIMPLE BEGINNER EXAMPLE: A Counter Function
function createCounter() {
  let count = 0; // Private variable!

  return function() {
    count++; // Inner function remembers 'count'
    return count;
  };
}

const counter1 = createCounter();
console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter1()); // 3

// Notice: You cannot access or modify 'count' directly from outside!
// console.log(count); // ❌ ReferenceError: count is not defined`,
    codeExample: `// 🔵 REAL-WORLD ADVANCED EXAMPLE: Secure Bank Account with Encapsulation
function createBankAccount(holderName, initialDeposit) {
  let balance = initialDeposit; // Private variable enclosed
  const transactions = [];

  return {
    getHolder: () => holderName,
    getBalance: () => balance,
    deposit: (amount) => {
      if (amount <= 0) throw new Error("Deposit must be positive");
      balance += amount;
      transactions.push({ type: "DEPOSIT", amount, date: new Date().toLocaleTimeString() });
      return balance;
    },
    withdraw: (amount) => {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      transactions.push({ type: "WITHDRAW", amount, date: new Date().toLocaleTimeString() });
      return balance;
    },
    getStatement: () => Object.freeze([...transactions])
  };
}

const myAcc = createBankAccount("Rajib", 1000);
myAcc.deposit(500);
myAcc.withdraw(200);
console.log("Current Balance:", myAcc.getBalance()); // 1300
console.log("Direct balance access:", myAcc.balance); // undefined (Safe & Encapsulated!)`,
    walkthrough: [
      "Line 2: 'balance' is defined inside createBankAccount.",
      "Line 5: The returned object holds methods (deposit, withdraw, getBalance) that form closures around 'balance'.",
      "Even though createBankAccount() finishes running, 'balance' remains securely stored in memory for myAcc methods."
    ],
    engineUnderTheHood: "When a function accesses outer variables, V8 allocates a [[Scopes]] array on the function object containing a Closure context. This keeps those specific referenced variables alive on the V8 heap rather than the stack frame.",
    commonPitfalls: "Closures can cause unintended memory leaks if you store large objects in outer scope and hold onto the inner function indefinitely (e.g., inside an event listener that is never removed)."
  },

  {
    id: "this-keyword-resolution",
    category: "Core Engine & Scope",
    difficulty: "Advanced",
    title: "The 'this' Keyword: Complete 4-Rule Resolution System",
    simpleExplanation: "In JavaScript, 'this' is NOT determined by where a function is written; it is determined by WHO is calling the function at the exact moment of execution (the call-site). The only exception is Arrow Functions, which borrow 'this' from their parent scope.",
    summary: "Unlike lexical variables, 'this' is dynamic and determined entirely by HOW a function is called at runtime (call-site).",
    syntax: "fn.call(thisArg, arg1, arg2)\nfn.apply(thisArg, [arg1, arg2])\nconst bound = fn.bind(thisArg, arg1)",
    returnType: "call/apply: Returns function's return value | bind: Returns a new permanently-bound Function",
    mutates: "No",
    conceptClarifiers: [
      {
        term: "The 4 Rules of 'this' (In order of priority)",
        meaning: "1. 'new' keyword: 'this' = newly created object. 2. Explicit (.call/.apply/.bind): 'this' = the object you specified. 3. Implicit (obj.fn()): 'this' = obj (the object before the dot). 4. Default: 'this' = window (or undefined in strict mode)."
      },
      {
        term: "Why do Arrow Functions behave differently?",
        meaning: "Arrow functions do NOT have their own 'this'. They copy 'this' from whatever surrounded them when they were created (Lexical this)."
      }
    ],
    simpleExample: `// 🟢 SIMPLE BEGINNER EXAMPLE: Who is calling the function?
const person = {
  name: "Alice",
  sayHi: function() {
    console.log("Hi, I am " + this.name);
  }
};

// 1. Called with dot (Implicit):
person.sayHi(); // "Hi, I am Alice" (this = person)

// 2. Extracted as a standalone function:
const greet = person.sayHi;
greet(); // "Hi, I am undefined" (this = window/undefined, lost connection!)

// 3. Reconnected using .bind():
const boundGreet = person.sayHi.bind(person);
boundGreet(); // "Hi, I am Alice" (fixed!)`,
    codeExample: `// 🔵 REAL-WORLD ADVANCED EXAMPLE: Explicit Binding & Arrow Function Inside Callback
const developer = {
  name: "Rajib",
  role: "Fullstack Architect",
  greet() {
    console.log(\`Hi, I am \${this.name}, \${this.role}\`);
  },
  delayedGreetArrow() {
    setTimeout(() => {
      console.log(\`Arrow Callback: \${this.name}\`);
    }, 100);
  },
  delayedGreetRegular() {
    setTimeout(function() {
      console.log(\`Regular Callback: \${this ? this.name : "undefined"}\`);
    }, 100);
  }
};

const externalUser = { name: "Sarah", role: "DevOps Engineer" };

developer.greet.call(externalUser); // "Hi, I am Sarah, DevOps Engineer"

developer.delayedGreetArrow();   // "Arrow Callback: Rajib"
developer.delayedGreetRegular(); // "Regular Callback: undefined"`,
    walkthrough: [
      "developer.greet.call(externalUser): We explicitly set 'this' to externalUser using .call().",
      "delayedGreetArrow(): Because setTimeout callback is an arrow function, it inherits 'this' from delayedGreetArrow (developer).",
      "delayedGreetRegular(): Because setTimeout callback is a standard function, the timer executes it standalone, making 'this' window or undefined."
    ],
    engineUnderTheHood: "The precedence order of 'this' binding is: 'new' binding > Explicit binding (.bind/.call) > Implicit binding (obj.method()) > Default binding. Arrow functions bypass this entirely by resolving 'this' like any normal variable in the scope chain.",
    commonPitfalls: "Passing object methods as event handlers or callbacks (e.g. `button.addEventListener('click', user.handleClick)`) detaches 'this', defaulting it to the element or undefined."
  },

  {
    id: "prototypes-and-inheritance",
    category: "Objects & Prototypes",
    difficulty: "Advanced",
    title: "Prototypes, Prototypal Inheritance & Modern Classes",
    simpleExplanation: "JavaScript does not have traditional classes like Java or C++. Instead, objects inherit directly from other objects through a chain of links called the Prototype Chain. If an object does not have a property, JS looks at its prototype, and then its prototype's prototype, until it finds it or hits null.",
    summary: "JavaScript uses prototypal delegation where objects inherit directly from other objects through prototype linkage.",
    syntax: "Object.create(proto, [propertiesObject])\nObject.getPrototypeOf(obj)\nObject.setPrototypeOf(obj, prototype)",
    returnType: "Object.create returns a new Object linking to specified proto",
    mutates: "Object.setPrototypeOf mutates target object prototype (avoid in production)",
    conceptClarifiers: [
      {
        term: "What is the difference between 'prototype' and '__proto__'?",
        meaning: "'prototype' is a property on constructor functions (e.g. Array.prototype). '__proto__' (or Object.getPrototypeOf) is the hidden link inside every object instance pointing to its parent blueprint."
      },
      {
        term: "What is the Prototype Chain?",
        meaning: "Imagine looking for a tool in your own toolbox. If it is not there, you check your father's toolbox. If not there, you check your grandfather's toolbox. In JS: obj -> obj.__proto__ -> Object.prototype -> null."
      }
    ],
    simpleExample: `// 🟢 SIMPLE BEGINNER EXAMPLE: Prototype Delegation
const animal = {
  isAlive: true,
  eat() {
    return "Eating food...";
  }
};

const dog = Object.create(animal);
dog.breed = "Golden Retriever";

console.log(dog.breed);   // "Golden Retriever" (found on dog itself)
console.log(dog.isAlive); // true (found on animal prototype!)
console.log(dog.eat());   // "Eating food..." (found on animal prototype!)`,
    codeExample: `// 🔵 REAL-WORLD ADVANCED EXAMPLE: Modern ES6 Class with Private Fields (#)
class PaymentGateway {
  #secretKey; // True private field (enforced by V8 engine)

  constructor(merchantId, secretKey) {
    this.merchantId = merchantId;
    this.#secretKey = secretKey;
  }

  processPayment(amount) {
    this.#logTransaction(amount);
    return \`Charge \$\${amount} authorized for merchant \${this.merchantId}\`;
  }

  #logTransaction(amount) {
    console.log(\`[AUDIT] Authorizing \$\${amount} using key ending in ...\${this.#secretKey.slice(-4)}\`);
  }
}

const gateway = new PaymentGateway("M_9876", "sk_live_secret_4455");
console.log(gateway.processPayment(150));`,
    walkthrough: [
      "Line 2: '#secretKey' creates a private variable that cannot be read or modified from outside the class.",
      "Line 16: The public method processPayment() calls the private #logTransaction method internally.",
      "Under the hood, ES6 classes compile down to constructor functions and Object.create prototype linkage."
    ],
    engineUnderTheHood: "V8 optimizes property access using 'Hidden Classes' (Shapes). Mutating prototype chains dynamically via `Object.setPrototypeOf` deletes the hidden class optimization, forcing V8 into slow dictionary mode for that object.",
    commonPitfalls: "Shadowing prototype properties: Modifying `instance.prop = value` creates an own property on instance instead of updating the prototype property."
  },

  {
    id: "event-loop-microtasks",
    category: "Asynchronous & Event Loop",
    difficulty: "Advanced",
    title: "The Event Loop, Microtask Queue & Macrotask Concurrency",
    simpleExplanation: "JavaScript can only do ONE thing at a time (single-threaded). When you do asynchronous things like fetch() or setTimeout(), JavaScript hands that work to the browser/Node C++ engine. When that work finishes, callbacks wait in queues. The Event Loop prioritizes Microtasks (Promises) first, and only runs Macrotasks (setTimeout) once ALL microtasks are finished.",
    summary: "JavaScript is single-threaded and non-blocking. The Event Loop continuously coordinates Call Stack execution, Web APIs, Microtasks (Promises), and Macrotasks (Timers/IO).",
    syntax: "queueMicrotask(() => { /* VIP Queue */ });\nsetTimeout(() => { /* Normal Queue */ }, 0);\nPromise.resolve().then(() => { /* VIP Queue */ });",
    returnType: "queueMicrotask: undefined | setTimeout: number (Timer ID)",
    mutates: "N/A",
    conceptClarifiers: [
      {
        term: "What is a Microtask Queue (VIP Express Queue)?",
        meaning: "Callbacks from Promises (.then/.catch), queueMicrotask(), and MutationObserver go here. The Event Loop drains the ENTIRE microtask queue before it touches any timer or paints the screen."
      },
      {
        term: "What is a Macrotask Queue (Regular Queue)?",
        meaning: "Callbacks from setTimeout, setInterval, setImmediate, and I/O events go here. They wait until all synchronous code and all microtasks are 100% finished."
      }
    ],
    simpleExample: `// 🟢 SIMPLE BEGINNER EXAMPLE: Who runs first?
console.log("1: Synchronous");

setTimeout(() => {
  console.log("2: setTimeout (Macrotask)");
}, 0);

Promise.resolve().then(() => {
  console.log("3: Promise (Microtask - VIP Queue)");
});

console.log("4: Synchronous");

// OUTPUT ORDER:
// 1: Synchronous
// 4: Synchronous
// 3: Promise (Microtask - VIP Queue)
// 2: setTimeout (Macrotask)`,
    codeExample: `// 🔵 REAL-WORLD ADVANCED EXAMPLE: Chained Microtasks vs Timers
console.log("Start");

setTimeout(() => {
  console.log("Timer 1 (Macrotask)");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("Promise 1 (Microtask)");
    return "Next";
  })
  .then((data) => {
    console.log("Promise 2 Chained (Microtask)");
  });

queueMicrotask(() => {
  console.log("queueMicrotask (Microtask)");
});

console.log("End");`,
    walkthrough: [
      "1. Synchronous code runs first ('Start', 'End').",
      "2. Timer 1 is queued in the Macrotask Queue.",
      "3. Promise 1 and queueMicrotask are placed in the Microtask Queue.",
      "4. Microtask Queue drains: Promise 1 logs, queueMicrotask logs.",
      "5. Promise 1's chained callback is placed into the Microtask Queue and runs immediately.",
      "6. Only after the Microtask Queue is completely empty does Timer 1 run."
    ],
    engineUnderTheHood: "Between every macrotask, the browser engine executes the 'Microtask Checkpoint'. It empties the ENTIRE microtask queue (including any new microtasks queued while draining) before painting or picking the next macrotask.",
    commonPitfalls: "Assuming `setTimeout(fn, 0)` executes immediately. It is always deferred until after the current synchronous script AND all pending microtasks have finished."
  },

  {
    id: "promises-and-combinators",
    category: "Asynchronous & Event Loop",
    difficulty: "Advanced",
    title: "Promises In-Depth & All 4 Combinators (all, allSettled, race, any)",
    simpleExplanation: "A Promise is like a restaurant buzzer. It starts in 'pending' state. When your food is ready, it is 'fulfilled' with your meal (value). If the kitchen burns down, it is 'rejected' with an error (reason). Combinators let you manage multiple buzzers at once.",
    summary: "Deep understanding of Promise lifecycles, states (pending, fulfilled, rejected), chaining mechanics, and the 4 combinator methods.",
    syntax: "Promise.all([p1, p2])\nPromise.allSettled([p1, p2])\nPromise.race([p1, p2])\nPromise.any([p1, p2])",
    returnType: "All combinators return a new Promise",
    mutates: "No",
    conceptClarifiers: [
      {
        term: "The 4 Combinators Quick Summary",
        meaning: "• Promise.all: All must succeed. If any 1 fails, it rejects immediately.\n• Promise.allSettled: Waits for all to finish, never rejects, gives report card of each.\n• Promise.race: First one to finish (win OR lose) wins.\n• Promise.any: First one to SUCCEED wins. Only rejects if all fail."
      }
    ],
    simpleExample: `// 🟢 SIMPLE BEGINNER EXAMPLE: Making and consuming a Promise
const fetchGreeting = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve("Hello, Student!"); // Fulfilled
  } else {
    reject(new Error("Network failed")); // Rejected
  }
});

fetchGreeting
  .then(message => console.log("Success:", message))
  .catch(err => console.error("Error:", err.message))
  .finally(() => console.log("Done!"));`,
    codeExample: `// 🔵 REAL-WORLD ADVANCED EXAMPLE: Handling Resilient Concurrent API Calls
const apiProfile = new Promise(r => setTimeout(() => r({ name: "Rajib" }), 50));
const apiPosts = new Promise(r => setTimeout(() => r(["Post 1", "Post 2"]), 100));
const apiFailingAdService = new Promise((_, reject) => 
  setTimeout(() => reject(new Error("Ad Blocker Active")), 80)
);

Promise.allSettled([apiProfile, apiPosts, apiFailingAdService])
  .then(outcomes => {
    outcomes.forEach((outcome, idx) => {
      if (outcome.status === "fulfilled") {
        console.log(\`Service \${idx} loaded successfully:\`, outcome.value);
      } else {
        console.warn(\`Service \${idx} failed silently:\`, outcome.reason.message);
      }
    });
  });`,
    walkthrough: [
      "apiProfile, apiPosts, and apiFailingAdService start concurrently.",
      "apiFailingAdService rejects at 80ms.",
      "Because we used Promise.allSettled instead of Promise.all, it does not fail-fast; it waits for all 3 to finish and returns a clean array with status for each."
    ],
    engineUnderTheHood: "A Promise is an object with an internal [[PromiseState]] ('pending', 'fulfilled', 'rejected') and [[PromiseResult]]. Once settled, its state is immutable. .then() returns a BRAND NEW Promise, enabling chaining without mutating previous promises.",
    commonPitfalls: "Forgotten return in .then(): If you don't return inside a .then() handler, the next .then() receives `undefined`."
  },

  {
    id: "advanced-array-methods",
    category: "Modern ESNext & Metaprogramming",
    difficulty: "Intermediate to Advanced",
    title: "Advanced Array Transformation: Syntax, Return Types & Mutability",
    simpleExplanation: "Arrays have methods to transform data. Older methods like .sort() and .splice() mutate (change) the original array, which causes tricky bugs. Modern ES2023 methods like .toSorted() and .with() are pure (they return a brand new array leaving the original untouched).",
    summary: "Comprehensive breakdown of higher-order array methods, including ES2023 non-mutating methods (.toSorted, .toReversed, .toSpliced, .with).",
    syntax: "arr.map(fn(element, index, array), thisArg)\narr.reduce(fn(acc, cur, idx, src), initialValue)\narr.flatMap(fn)\narr.toSorted(compareFn)\narr.with(index, value)",
    returnType: "map/filter/flatMap/toSorted: Array | reduce: any | find: element or undefined | some/every: boolean",
    mutates: "Older methods: .sort(), .reverse(), .splice() MUTATE original array. Modern methods: .toSorted(), .toReversed(), .toSpliced(), .with() are PURE (return new array).",
    conceptClarifiers: [
      {
        term: "What is Mutating vs Pure (Non-mutating)?",
        meaning: "Mutating means modifying the original paper. Pure means making a photocopy first and writing on the copy, leaving the original paper pristine and safe."
      }
    ],
    simpleExample: `// 🟢 SIMPLE BEGINNER EXAMPLE: Safe Non-Mutating Array Sorting (ES2023)
const originalNumbers = [40, 10, 100, 25];

// Modern .toSorted() does NOT change originalNumbers:
const sortedNumbers = originalNumbers.toSorted((a, b) => a - b);

console.log("Original kept pure:", originalNumbers); // [40, 10, 100, 25]
console.log("Sorted copy:", sortedNumbers);           // [10, 25, 40, 100]

// .with(index, newValue) immutably replaces 1 item:
const replaced = originalNumbers.with(0, 999);
console.log("Replaced copy:", replaced);             // [999, 10, 100, 25]`,
    codeExample: `// 🔵 REAL-WORLD ADVANCED EXAMPLE: Complex reduce & flatMap
const products = [
  { id: 1, name: "Keyboard", price: 100, tags: ["hardware", "pc"] },
  { id: 2, name: "Mouse", price: 50, tags: ["hardware", "wireless"] },
  { id: 3, name: "Monitor", price: 300, tags: ["display", "pc"] }
];

// 1. reduce to create a lookup map by ID
const productMap = products.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});
console.log("Product Map:", productMap);

// 2. flatMap to extract all unique tags
const uniqueTags = [...new Set(products.flatMap(p => p.tags))];
console.log("Unique Tags:", uniqueTags);`,
    walkthrough: [
      "products.reduce() builds an $O(1)$ fast lookup dictionary where each product is indexed by id.",
      "products.flatMap() extracts the tags array from each item and flattens them into a single list.",
      "new Set() filters out duplicates, and spread operator turns it back into an array."
    ],
    engineUnderTheHood: "In V8, arrays can be represented as packed (dense) or holey (sparse) elements, stored as SMI (Small Integers), Doubles, or Objects. Methods like `map` and `filter` preserve array packing for maximum JIT speed.",
    commonPitfalls: "Using `array.sort()` without a compare function sorts lexicographically by string representation (e.g., `[10, 2, 5].sort()` becomes `[10, 2, 5]` because '10' < '2')."
  },

  {
    id: "generators-and-iterators",
    category: "Modern ESNext & Metaprogramming",
    difficulty: "Advanced",
    title: "Iterators, Iterables & Generator Functions",
    simpleExplanation: "Normal functions run from start to finish without stopping. A Generator function (written with an asterisk `function*`) can PAUSE in the middle using the `yield` keyword, and RESUME later when you call `.next()`. This allows you to generate infinite streams of data without using up memory.",
    summary: "The iteration protocol and generator functions that can pause and resume execution, enabling lazy evaluation and infinite data streams.",
    syntax: "function* generatorFn() {\n  yield value;\n  yield* anotherIterable;\n}\nconst iter = generatorFn();\niter.next(); // { value: any, done: boolean }",
    returnType: "Generator Object (implements both Iterator and Iterable protocols)",
    mutates: "Maintains internal state machine across yields",
    conceptClarifiers: [
      {
        term: "What is an Iterable vs an Iterator?",
        meaning: "An Iterable is any object you can loop over with for...of (has [Symbol.iterator]). An Iterator is the pointer that actually moves through the items via .next()."
      }
    ],
    simpleExample: `// 🟢 SIMPLE BEGINNER EXAMPLE: A Pausing Generator
function* countUpToThree() {
  console.log("Starting...");
  yield 1; // Pauses here!
  console.log("Resuming...");
  yield 2; // Pauses here!
  console.log("Resuming again...");
  yield 3; // Pauses here!
}

const counter = countUpToThree();
console.log(counter.next()); // { value: 1, done: false }
console.log(counter.next()); // { value: 2, done: false }
console.log(counter.next()); // { value: 3, done: false }
console.log(counter.next()); // { value: undefined, done: true }`,
    codeExample: `// 🔵 REAL-WORLD ADVANCED EXAMPLE: Infinite ID Generator & Custom Iterable
function* idGenerator(prefix = "USR") {
  let id = 1;
  while (true) {
    const reset = yield \`\${prefix}-\${id}\`;
    if (reset) {
      id = 1;
    } else {
      id++;
    }
  }
}

const gen = idGenerator("ORD");
console.log(gen.next().value); // "ORD-1"
console.log(gen.next().value); // "ORD-2"
console.log(gen.next(true).value); // Reset triggered: "ORD-1"`,
    walkthrough: [
      "The while(true) loop does NOT freeze the computer because execution pauses completely at `yield`.",
      "Calling gen.next(true) passes the value 'true' back INTO the paused generator function, triggering the reset branch."
    ],
    engineUnderTheHood: "Generators compile down to state machines. V8 suspends the generator's stack frame on `yield`, saving variable pointers in a heap-allocated generator context, and reactivates it upon `.next()`.",
    commonPitfalls: "Iterators are single-use by default. Once `done: true` is returned, subsequent calls to `next()` will continuously return `{ done: true }`."
  },

  {
    id: "proxy-and-reflect",
    category: "Modern ESNext & Metaprogramming",
    difficulty: "Advanced",
    title: "Proxy & Reflect: Metaprogramming & Reactivity",
    simpleExplanation: "A Proxy acts like a security guard standing in front of an object. Whenever someone tries to read a property, write a value, or delete something, the Proxy intercepts the request first. This is how modern frameworks like Vue 3 build reactivity.",
    summary: "The Proxy object enables you to intercept and customize fundamental operations for another object.",
    syntax: "const proxy = new Proxy(target, handler);\nReflect.get(target, property, receiver)\nReflect.set(target, property, value, receiver)",
    returnType: "new Proxy: Proxy instance | Reflect.set: boolean | Reflect.get: any",
    mutates: "Proxy wraps target; actions pass through to target unless intercepted",
    conceptClarifiers: [
      {
        term: "What is a Trap?",
        meaning: "A 'trap' is an interceptor method on the handler (like get, set, has, deleteProperty) that catches an operation before it reaches the real object."
      }
    ],
    simpleExample: `// 🟢 SIMPLE BEGINNER EXAMPLE: Age Validator Proxy
const user = { name: "Rajib", age: 25 };

const validatorProxy = new Proxy(user, {
  set(target, property, value) {
    if (property === "age" && (typeof value !== "number" || value < 0)) {
      throw new TypeError("Age must be a positive number!");
    }
    target[property] = value;
    return true;
  }
});

validatorProxy.age = 26; // Works!
console.log("Updated age:", user.age); // 26
// validatorProxy.age = "twenty"; // ❌ Throws TypeError: Age must be a positive number!`,
    codeExample: `// 🔵 REAL-WORLD ADVANCED EXAMPLE: Building a Reactive State System (Vue 3 Core)
function createObservable(target, onChange) {
  const handler = {
    get(obj, prop, receiver) {
      console.log(\`[READ] Accessed: \${String(prop)}\`);
      return Reflect.get(obj, prop, receiver);
    },
    set(obj, prop, value, receiver) {
      const oldValue = obj[prop];
      if (oldValue === value) return true;
      const success = Reflect.set(obj, prop, value, receiver);
      if (success) {
        console.log(\`[UPDATE] \${String(prop)} changed from \${oldValue} to \${value}\`);
        onChange(prop, value, oldValue);
      }
      return success;
    }
  };

  return new Proxy(target, handler);
}

const state = createObservable({ counter: 0 }, (prop, val) => {
  console.log(\`⚡ UI Re-rendered automatically for \${prop} = \${val}\`);
});

state.counter = 1; // Automatically triggers set trap & UI re-render!`,
    walkthrough: [
      "Whenever state.counter is modified, the 'set' trap intercepts the assignment.",
      "Reflect.set performs the actual value assignment safely.",
      "The onChange callback triggers UI notification automatically."
    ],
    engineUnderTheHood: "Proxies intercept low-level operations at the engine level. Always use `Reflect` methods inside traps with `receiver` argument to ensure correct `this` binding inside getters/setters on inherited objects.",
    commonPitfalls: "Proxies cannot intercept private fields (#field) unless explicitly delegated, and `target === proxy` evaluates to `false`."
  },

  {
    id: "memory-and-gc",
    category: "Memory & Performance",
    difficulty: "Advanced",
    title: "Memory Management, Garbage Collection & Weak References",
    simpleExplanation: "JavaScript automatically cleans up memory you are no longer using (Garbage Collection). But if you accidentally hold a reference to an object (like in an unused variable or global array), JavaScript cannot clean it up, leading to a Memory Leak. WeakMap and WeakSet prevent memory leaks by holding 'weak' links that allow garbage collection.",
    summary: "How V8 allocates memory (Stack vs Heap), executes Generational Garbage Collection, and how WeakMap/WeakSet prevent memory leaks.",
    syntax: "const wm = new WeakMap();\nwm.set(objectKey, metadata);\nconst ws = new WeakSet();\nws.add(objectRef);",
    returnType: "WeakMap.set: WeakMap | WeakMap.get: any | WeakMap.has: boolean",
    mutates: "WeakMap / WeakSet mutate internal bucket",
    conceptClarifiers: [
      {
        term: "What is a Memory Leak?",
        meaning: "When memory that is no longer needed by the app is NOT released because an accidental reference is still pointing to it."
      },
      {
        term: "What is Mark-and-Sweep?",
        meaning: "The V8 engine starts at 'Roots' (global window, active call stack). It marks everything it can reach. Anything left unmarked is swept away and deleted from memory."
      }
    ],
    simpleExample: `// 🟢 SIMPLE BEGINNER EXAMPLE: Preventing Memory Leaks with WeakMap
const cache = new WeakMap();

let user = { name: "Rajib", id: 101 };
cache.set(user, "User Profile Metadata");

console.log("Cached data:", cache.get(user)); // "User Profile Metadata"

// When user is set to null, the WeakMap entry is AUTOMATICALLY cleaned up!
user = null; // No memory leak! WeakMap releases it automatically.`,
    codeExample: `// 🔵 REAL-WORLD ADVANCED EXAMPLE: WeakSet for Object Tracking
const activeConnections = new WeakSet();

class WebSocketSession {
  constructor(userId) {
    this.userId = userId;
    activeConnections.add(this);
  }

  isOpen() {
    return activeConnections.has(this);
  }

  close() {
    activeConnections.delete(this);
    console.log(\`Session for user \${this.userId} closed\`);
  }
}

let session = new WebSocketSession("USER_445");
console.log("Is session open?", session.isOpen()); // true
session.close();
console.log("Is session open?", session.isOpen()); // false`,
    walkthrough: [
      "WeakSet only stores object references.",
      "If session is set to null elsewhere, WeakSet does not block Garbage Collection."
    ],
    engineUnderTheHood: "V8 splits heap into Young Generation (frequently allocated/cleared via fast Scavenge algorithm) and Old Generation (long-lived objects cleared via Mark-Sweep-Compact). WeakMaps allow keys to be collected without explicit cleanup.",
    commonPitfalls: "Storing DOM elements or components as keys in a regular `Map` prevents the element from ever being garbage collected, even after being removed from the DOM."
  },

  {
    id: "currying-and-composition",
    category: "Advanced Functional Patterns",
    difficulty: "Advanced",
    title: "Currying, Partial Application & Function Composition",
    simpleExplanation: "Currying is transforming a function that takes multiple arguments at once (like `f(a, b, c)`) into a chain of functions that each take one argument at a time (like `f(a)(b)(c)`). Function composition is connecting functions like lego blocks so the output of one flows into the next.",
    summary: "Transforming multi-argument functions into unary function chains, and composing reusable data processing pipelines.",
    syntax: "const curry = (fn) => ...\nconst pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);\nconst compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);",
    returnType: "Returns higher-order functions",
    mutates: "No (Pure functional)",
    conceptClarifiers: [
      {
        term: "What is Currying vs Partial Application?",
        meaning: "Currying always turns f(a, b, c) into a chain of 1-argument functions: f(a)(b)(c). Partial application fixes some arguments now, returning a function that accepts the remaining arguments."
      }
    ],
    simpleExample: `// 🟢 SIMPLE BEGINNER EXAMPLE: Simple Curried Greeting
// Normal function:
const greet = (greeting, name) => \`\${greeting}, \${name}!\`;

// Curried function:
const curriedGreet = (greeting) => (name) => \`\${greeting}, \${name}!\`;

const sayHello = curriedGreet("Hello");
console.log(sayHello("Rajib")); // "Hello, Rajib!"
console.log(sayHello("Sarah")); // "Hello, Sarah!"`,
    codeExample: `// 🔵 REAL-WORLD ADVANCED EXAMPLE: Production Data Pipeline using Pipe
const pipe = (...fns) => (initialValue) => 
  fns.reduce((acc, fn) => fn(acc), initialValue);

const trim = (str) => str.trim();
const toLower = (str) => str.toLowerCase();
const sanitizeSlug = (str) => str.replace(/\\s+/g, "-");
const addPrefix = (prefix) => (str) => \`\${prefix}/\${str}\`;

const generateArticleUrl = pipe(
  trim,
  toLower,
  sanitizeSlug,
  addPrefix("https://techblog.com/posts")
);

console.log(generateArticleUrl("  Advanced JavaScript Patterns For MNCs! "));
// "https://techblog.com/posts/advanced-javascript-patterns-for-mncs!"`,
    walkthrough: [
      "pipe() takes functions and executes them left-to-right on the input data.",
      "The text is trimmed, lowercased, converted to URL slug, and prefixed seamlessly."
    ],
    engineUnderTheHood: "Curried functions maintain scope chains via closures for each argument. Modern V8 engines inline small unary functions effectively, minimizing performance overhead.",
    commonPitfalls: "Using default parameters or rest parameters `(...args)` causes `fn.length` to be 0 or exclude those arguments, which breaks naive curry implementations relying on `fn.length`."
  }
];
