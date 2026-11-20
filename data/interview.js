/**
 * MNC Interview Vault
 * Curated specifically for top product & IT services MNCs:
 * Google, Amazon, Microsoft, Meta, TCS, Infosys, Cognizant, Wipro, Accenture, Capgemini, HCL.
 */

export const INTERVIEW_QUESTIONS = [
  // ==========================================
  // 1. TRICKY OUTPUT-BASED QUESTIONS
  // ==========================================
  {
    id: "out-var-vs-let-timeout",
    type: "output",
    difficulty: "Easy",
    companies: ["Amazon", "TCS", "Infosys", "Cognizant", "Wipro"],
    title: "The Classic 'var' vs 'let' inside setTimeout Loop",
    question: "What is logged to the console by Loop A and Loop B, and why?",
    codeSnippet: `// Loop A:
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("Loop A:", i), 100);
}

// Loop B:
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("Loop B:", j), 100);
}`,
    answer: `OUTPUT:
Loop A: 3, 3, 3
Loop B: 0, 1, 2

EXPLANATION:
1. 'var' is function/globally scoped, NOT block scoped. There is only ONE shared variable 'i' across all iterations. By the time the macrotask queue executes the setTimeout callbacks (~100ms later), the synchronous loop has already completed and 'i' has become 3. All 3 callbacks refer to the same 'i'.
2. 'let' is block-scoped. On each iteration of the loop, the JS engine creates a new lexical binding for 'j'. Each callback forms a closure over its own unique, distinct iteration instance of 'j'.
3. Alternative fix for 'var': Use an IIFE (Immediately Invoked Function Expression) to capture 'i' in a functional closure, or pass 'i' as the third argument to setTimeout(fn, 100, i).`,
    runnableCode: `// Run to observe output
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("Loop A (var):", i), 100);
}

for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("Loop B (let):", j), 100);
}

// IIFE solution for var:
for (var k = 0; k < 3; k++) {
  ((val) => {
    setTimeout(() => console.log("Loop C (IIFE):", val), 100);
  })(k);
}`,
    interviewerTip: "MNC interviewers will ask: 'How can you fix Loop A without changing var to let?' Mention both IIFE and setTimeout third argument."
  },

  {
    id: "out-event-loop-microtasks",
    type: "output",
    difficulty: "Hard",
    companies: ["Google", "Amazon", "Microsoft", "Accenture"],
    title: "Event Loop Priority: Microtasks vs Macrotasks vs Synchronous",
    question: "Predict the exact order of console.log outputs.",
    codeSnippet: `console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
  setTimeout(() => console.log("D"), 0);
}).then(() => {
  console.log("E");
});

queueMicrotask(() => {
  console.log("F");
});

console.log("G");`,
    answer: `EXACT OUTPUT:
A
G
C
F
E
B
D

STEP-BY-STEP EXECUTION FLOW:
1. Synchronous phase:
   - "A" logged.
   - setTimeout #B registered in Web API -> Macrotask Queue.
   - Promise #C registered -> Microtask Queue.
   - queueMicrotask #F registered -> Microtask Queue.
   - "G" logged.
2. Microtask Queue Drain (All microtasks must execute before macrotasks):
   - First microtask #C runs -> logs "C".
   - Inside #C, setTimeout #D is registered -> Macrotask Queue.
   - #C returns, chaining .then(#E) into Microtask Queue.
   - Next microtask #F runs -> logs "F".
   - Next microtask #E runs -> logs "E".
   - Microtask queue is now empty.
3. Macrotask Queue Processing:
   - Next macrotask in line is #B -> logs "B".
   - Next macrotask in line is #D -> logs "D".`,
    runnableCode: `console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

Promise.resolve().then(() => {
  console.log("C");
  setTimeout(() => console.log("D"), 0);
}).then(() => {
  console.log("E");
});

queueMicrotask(() => {
  console.log("F");
});

console.log("G");`,
    interviewerTip: "Emphasize that the Microtask Queue is completely drained between EVERY macrotask. Even if a microtask schedules another microtask, it will execute before any macrotask."
  },

  {
    id: "out-this-arrow-vs-regular",
    type: "output",
    difficulty: "Medium",
    companies: ["Infosys", "Cognizant", "TCS", "Accenture", "Microsoft"],
    title: "Object Methods: Arrow Functions vs Regular Function 'this'",
    question: "What will each method call print?",
    codeSnippet: `const obj = {
  name: "CodeCloud",
  regularFn: function() {
    return this.name;
  },
  arrowFn: () => {
    return this ? this.name : "undefined";
  },
  nestedFn: function() {
    const subArrow = () => this.name;
    function subRegular() {
      return this ? this.name : "undefined";
    }
    return [subArrow(), subRegular()];
  }
};

console.log("1:", obj.regularFn());
console.log("2:", obj.arrowFn());
console.log("3:", obj.nestedFn());`,
    answer: `OUTPUT:
1: "CodeCloud"
2: undefined (or empty/window.name in non-strict browser)
3: ["CodeCloud", undefined]

REASONING:
1. obj.regularFn(): Invoked with implicit binding (obj.method). 'this' points to 'obj'.
2. obj.arrowFn(): Arrow functions DO NOT bind their own 'this'. They inherit 'this' lexically from their enclosing lexical context at definition time. The object literal does not create a lexical scope! Therefore, the enclosing scope is the Global/Module scope where this.name is undefined.
3. obj.nestedFn():
   - subArrow inherits 'this' from nestedFn. Since nestedFn was called on obj, subArrow sees 'this' as 'obj'.
   - subRegular is called standalone (subRegular()), which uses Default Binding ('this' is undefined in strict mode or window in sloppy mode).`,
    runnableCode: `const obj = {
  name: "CodeCloud",
  regularFn: function() {
    return this.name;
  },
  arrowFn: () => {
    return typeof this !== "undefined" ? this.name : "undefined";
  },
  nestedFn: function() {
    const subArrow = () => this.name;
    function subRegular() {
      return typeof this !== "undefined" ? this.name : "undefined";
    }
    return [subArrow(), subRegular()];
  }
};

console.log("1:", obj.regularFn());
console.log("2:", obj.arrowFn());
console.log("3:", obj.nestedFn());`,
    interviewerTip: "Common trap: Many candidates think object curly braces '{}' create a new scope for arrow functions. Remind the interviewer that only functions and code blocks with let/const create scope, not object literals."
  },

  {
    id: "out-type-coercion-bizarre",
    type: "output",
    difficulty: "Medium",
    companies: ["Amazon", "TCS", "Wipro", "HCL", "Capgemini"],
    title: "JavaScript Type Coercion Mysteries",
    question: "What do the following expressions evaluate to?",
    codeSnippet: `console.log([] + []);
console.log([] + {});
console.log({} + []);
console.log(true + true);
console.log(0.1 + 0.2 === 0.3);
console.log(NaN === NaN);
console.log(typeof null);`,
    answer: `RESULTS & REASONS:
1. [] + [] => "" (empty string). Both arrays are coerced to primitives via .toString(). [].toString() is "", so "" + "" = "".
2. [] + {} => "[object Object]". [] becomes "", {} becomes "[object Object]".
3. {} + [] => In node/parentheses: "[object Object]". In some browser console contexts, the leading {} is parsed as an empty code block, leaving +[] which coerces to 0!
4. true + true => 2. The '+' operator coerces booleans to numbers (1 + 1 = 2).
5. 0.1 + 0.2 === 0.3 => false. IEEE 754 floating point arithmetic precision: 0.1 + 0.2 equals 0.30000000000000004. Fix: Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON.
6. NaN === NaN => false. By IEEE standard, NaN is never equal to anything, including itself. Use Number.isNaN().
7. typeof null => "object". A historical 30-year-old bug from JavaScript's first release where object type tag in binary was 000, and null pointer was NULL (0x00).`,
    runnableCode: `console.log("[] + [] =", JSON.stringify([] + []));
console.log("[] + {} =", [] + {});
console.log("true + true =", true + true);
console.log("0.1 + 0.2 =", 0.1 + 0.2);
console.log("0.1 + 0.2 === 0.3 :", 0.1 + 0.2 === 0.3);
console.log("Using EPSILON:", Math.abs((0.1 + 0.2) - 0.3) < Number.EPSILON);
console.log("NaN === NaN :", NaN === NaN);
console.log("typeof null :", typeof null);`,
    interviewerTip: "When discussing `0.1 + 0.2`, proactively mention `Number.EPSILON`. That signals deep knowledge of JavaScript numeric representation."
  },

  // ==========================================
  // 2. POLYFILL IMPLEMENTATIONS (HIGH FREQUENCY)
  // ==========================================
  {
    id: "poly-map-filter-reduce",
    type: "polyfill",
    difficulty: "Medium",
    companies: ["Amazon", "Google", "Microsoft", "TCS", "Accenture", "Cognizant"],
    title: "Write Polyfills for Array.prototype.myMap, myFilter, and myReduce",
    question: "Implement custom polyfills for Array map, filter, and reduce handling all native edge cases (sparse arrays, thisArg, initialValue).",
    codeSnippet: `// 1. Array.prototype.myMap
Array.prototype.myMap = function(callback, thisArg) { ... };

// 2. Array.prototype.myFilter
Array.prototype.myFilter = function(callback, thisArg) { ... };

// 3. Array.prototype.myReduce
Array.prototype.myReduce = function(callback, initialValue) { ... };`,
    answer: `KEY IMPLEMENTATION CRITERIA:
1. Must check if callback is a function (throw TypeError otherwise).
2. Must verify 'this' is not null or undefined.
3. In myMap and myFilter: preserve thisArg using callback.call(thisArg, this[i], i, this).
4. In myReduce:
   - Handle empty array without initialValue (throw TypeError).
   - If initialValue is omitted, the first valid element becomes the accumulator, and the loop starts from index 1.
   - Handle sparse arrays using 'i in this'.`,
    runnableCode: `// 1. myMap Polyfill
Array.prototype.myMap = function(callback, thisArg) {
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function');
  }
  const result = new Array(this.length);
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  return result;
};

// 2. myFilter Polyfill
Array.prototype.myFilter = function(callback, thisArg) {
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

// 3. myReduce Polyfill
Array.prototype.myReduce = function(callback, initialValue) {
  if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');
  const len = this.length;
  let startIndex = 0;
  let accumulator;

  if (arguments.length >= 2) {
    accumulator = initialValue;
  } else {
    // Find first non-empty index
    while (startIndex < len && !(startIndex in this)) {
      startIndex++;
    }
    if (startIndex >= len) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    accumulator = this[startIndex++];
  }

  for (let i = startIndex; i < len; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }
  return accumulator;
};

// Test Runs:
const nums = [1, 2, 3, 4, 5];
console.log("myMap (*2):", nums.myMap(x => x * 2));
console.log("myFilter (even):", nums.myFilter(x => x % 2 === 0));
console.log("myReduce (sum):", nums.myReduce((acc, x) => acc + x, 0));`,
    interviewerTip: "Always mention handling sparse arrays (e.g. `[1, , 3]`). Checking `i in this` ensures skipped indices are not processed, exactly as the ECMAScript specification dictates."
  },

  {
    id: "poly-function-bind",
    type: "polyfill",
    difficulty: "Hard",
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    title: "Write Polyfill for Function.prototype.myBind",
    question: "Implement custom Function.prototype.myBind supporting partial application and the 'new' operator constructor behavior.",
    codeSnippet: `Function.prototype.myBind = function(thisArg, ...boundArgs) {
  // Must return a function
  // Must support currying/partial args
  // Must support calling with 'new'
};`,
    answer: `WHAT MAKES BIND HARD:
1. Returns a new wrapper function.
2. Combines initial preset arguments (boundArgs) with arguments supplied when the bound function is invoked (laterArgs).
3. Critical Edge Case: If the bound function is used as a constructor with 'new' (e.g. \`new BoundFn()\`), the explicit thisArg must be ignored, and 'this' must refer to the newly created instance!`,
    runnableCode: `Function.prototype.myBind = function(thisArg, ...boundArgs) {
  if (typeof this !== 'function') {
    throw new TypeError('Cannot bind non-function');
  }

  const originalFn = this;

  function boundFunction(...callArgs) {
    // Check if called with 'new'
    const isNewInstance = this instanceof boundFunction;
    return originalFn.apply(
      isNewInstance ? this : thisArg,
      [...boundArgs, ...callArgs]
    );
  }

  // Preserve prototype chain for instance checks
  if (originalFn.prototype) {
    boundFunction.prototype = Object.create(originalFn.prototype);
  }

  return boundFunction;
};

// Verification:
function greet(greeting, punctuation) {
  return \`\${greeting}, \${this.name}\${punctuation}\`;
}

const user = { name: "Rajib" };
const sayHello = greet.myBind(user, "Hello");
console.log(sayHello("!")); // "Hello, Rajib!"

// Constructor test:
function Person(name) {
  this.name = name;
}
const BoundPerson = Person.myBind({ name: "Ignored" });
const p = new BoundPerson("Alice");
console.log("Instance test with 'new':", p.name); // "Alice" (NOT "Ignored")`,
    interviewerTip: "Testing `this instanceof boundFunction` proves you understand the ES5 spec requirement that 'new' overrides explicit bind."
  },

  {
    id: "poly-promise-all",
    type: "polyfill",
    difficulty: "Hard",
    companies: ["Amazon", "Google", "Meta", "Uber", "Accenture"],
    title: "Write Polyfill for Promise.all & Promise.allSettled",
    question: "Implement Promise.myAll and Promise.myAllSettled without using built-in combinators.",
    codeSnippet: `Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => { ... });
};`,
    answer: `REQUIREMENTS FOR PROMISE.ALL:
1. Returns a new Promise.
2. Accepts any iterable (not just array). If iterable is empty, resolves immediately with [].
3. Wraps each item in Promise.resolve(item) because items may be non-promise values.
4. Preserves result order corresponding to input order (not completion order!).
5. Rejects immediately on the FIRST rejection (fail-fast).
6. Uses a counter to track completed promises, resolving when counter === total.`,
    runnableCode: `// 1. Promise.myAll
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    if (!promises || typeof promises[Symbol.iterator] !== 'function') {
      return reject(new TypeError("Arguments must be iterable"));
    }

    const items = [...promises];
    if (items.length === 0) return resolve([]);

    const results = new Array(items.length);
    let completedCount = 0;

    items.forEach((item, index) => {
      // Handle primitives by wrapping in Promise.resolve
      Promise.resolve(item)
        .then(value => {
          results[index] = value;
          completedCount++;
          if (completedCount === items.length) {
            resolve(results);
          }
        })
        .catch(err => {
          // Fail fast on first rejection
          reject(err);
        });
    });
  });
};

// 2. Promise.myAllSettled
Promise.myAllSettled = function(promises) {
  return new Promise((resolve) => {
    const items = [...promises];
    if (items.length === 0) return resolve([]);

    const results = new Array(items.length);
    let settledCount = 0;

    items.forEach((item, index) => {
      Promise.resolve(item)
        .then(value => {
          results[index] = { status: "fulfilled", value };
        })
        .catch(reason => {
          results[index] = { status: "rejected", reason };
        })
        .finally(() => {
          settledCount++;
          if (settledCount === items.length) {
            resolve(results);
          }
        });
    });
  });
};

// Test:
const p1 = Promise.resolve(10);
const p2 = new Promise(r => setTimeout(() => r(20), 50));
const p3 = 30; // non-promise

Promise.myAll([p1, p2, p3]).then(vals => {
  console.log("Promise.myAll Output:", vals); // [10, 20, 30]
});`,
    interviewerTip: "Why use a `completedCount` counter instead of checking `results.length === items.length`? Because if task #2 finishes before task #1, setting `results[2] = val` creates empty slots and makes length 3 prematurely!"
  },

  {
    id: "poly-array-flat",
    type: "polyfill",
    difficulty: "Medium",
    companies: ["TCS", "Infosys", "Cognizant", "Capgemini", "Amazon"],
    title: "Write Polyfill for Array.prototype.flat with Depth",
    question: "Flatten a nested array to a specified depth without using built-in Array.prototype.flat.",
    codeSnippet: `Array.prototype.myFlat = function(depth = 1) {
  // Flatten array up to 'depth' levels
};`,
    answer: `STRATEGY:
1. Base cases: depth < 1 returns a shallow copy of the array.
2. Iterate through items using reduce or for-loop.
3. If an item is an Array (Array.isArray(item)) and depth > 0, recursively call myFlat(depth - 1) and concatenate.
4. Otherwise, push the item into the accumulator.`,
    runnableCode: `Array.prototype.myFlat = function(depth = 1) {
  if (depth < 1) return this.slice();

  return this.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...item.myFlat(depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
};

// Test
const nested = [1, [2, [3, [4, 5]]]];
console.log("Depth 1:", nested.myFlat(1)); // [1, 2, [3, [4, 5]]]
console.log("Depth 2:", nested.myFlat(2)); // [1, 2, 3, [4, 5]]
console.log("Depth Infinity:", nested.myFlat(Infinity)); // [1, 2, 3, 4, 5]`,
    interviewerTip: "Bonus point: Show iterative solution using a stack to prevent call stack overflow for massively nested arrays."
  },

  // ==========================================
  // 3. CONCEPTUAL & ARCHITECTURE (MNC CORE)
  // ==========================================
  {
    id: "conc-debounce-vs-throttle",
    type: "concept",
    difficulty: "Medium",
    companies: ["Amazon", "Uber", "Flipkart", "TCS", "Accenture", "Infosys"],
    title: "Debounce vs Throttle: Differences & Production Use Cases",
    question: "Explain the architectural difference between Debounce and Throttle with real-world frontend scenarios.",
    codeSnippet: `// Debounce: Delays execution until 'delay' ms has passed since the LAST event.
// Throttle: Guarantees execution at most once every 'limit' ms.`,
    answer: `DIFFERENCE MATRIX:
1. Debounce:
   - Behavior: Postpones function execution until silence occurs for X milliseconds. If another event fires before X ms, the timer resets.
   - Use Cases:
     * Search Autocomplete input (wait until user stops typing).
     * Auto-saving form data (save 1 second after last keystroke).
     * Window resize recalculations.
2. Throttle:
   - Behavior: Ensures the function runs at most once in a specified time window, regardless of how many times the trigger occurs.
   - Use Cases:
     * Infinite scroll & Scroll position tracking (check scroll position every 200ms).
     * Game loop / Drag and drop movements.
     * Rate-limiting fast button clicks (preventing duplicate submissions).`,
    runnableCode: `// Production Debounce
function debounce(fn, delay) {
  let timerId;
  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Production Throttle
function throttle(fn, limit) {
  let inThrottle = false;
  return function(...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Verification simulation:
const logSearch = debounce((q) => console.log("Searching for:", q), 300);
logSearch("r");
logSearch("ra");
logSearch("rajib"); // Only this final one fires!`,
    interviewerTip: "Mention the 'leading vs trailing edge' option for debounce (e.g. firing immediately on first click, then suppressing until cooldown)."
  },

  {
    id: "conc-deep-vs-shallow-copy",
    type: "concept",
    difficulty: "Medium",
    companies: ["Microsoft", "Google", "Cognizant", "Wipro", "TCS"],
    title: "Deep Copy vs Shallow Copy & Limitations of JSON.stringify",
    question: "Explain shallow vs deep copy. Why is JSON.parse(JSON.stringify(obj)) unsafe in production, and what is the modern standard?",
    codeSnippet: `const obj = {
  date: new Date(),
  fn: () => "hello",
  undef: undefined,
  sym: Symbol("id"),
  circular: null
};
obj.circular = obj;`,
    answer: `SHALLOW COPY:
- Copies only top-level properties. Nested objects still share the same memory reference.
- Methods: Object.assign({}, obj), Spread operator ({ ...obj }), slice() on arrays.

DEEP COPY:
- Recursively clones all nested objects and arrays into distinct memory addresses.

WHY JSON.parse(JSON.stringify(obj)) IS DANGEROUS:
1. Dates turn into strings (loses Date methods like .getTime()).
2. Functions, undefined, and Symbols are completely silently omitted or converted to null in arrays.
3. RegExps and Maps/Sets are converted to empty objects {}.
4. Fails with TypeError: Converting circular structure to JSON.

MODERN NATIVE SOLUTION:
- window.structuredClone(obj): Supported in all modern browsers and Node 17+. Correctly clones Dates, Sets, Maps, TypedArrays, and handles circular references! (Note: structuredClone still throws on functions).`,
    runnableCode: `const original = {
  name: "Rajib",
  created: new Date(),
  tags: ["js", "architecture"]
};

// Modern Native API
const clone = structuredClone(original);
clone.tags.push("performance");

console.log("Original tags length:", original.tags.length); // 2 (unaffected!)
console.log("Clone tags length:", clone.tags.length);       // 3
console.log("Date preserved as Date instance:", clone.created instanceof Date); // true`,
    interviewerTip: "Always mention `structuredClone` as the modern ES standard, while acknowledging its limitation with functions/DOM nodes."
  },

  {
    id: "conc-event-bubbling-capturing",
    type: "concept",
    difficulty: "Easy",
    companies: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant"],
    title: "Event Propagation: Bubbling, Capturing & Event Delegation",
    question: "What are the 3 phases of DOM event propagation, and why is Event Delegation a critical performance pattern?",
    codeSnippet: `element.addEventListener('click', handler, { capture: true });
e.stopPropagation();
e.preventDefault();`,
    answer: `3 PHASES OF EVENT PROPAGATION:
1. Capturing Phase (Trickling): Event travels down from window -> document -> body -> ancestors down to the target element.
2. Target Phase: Event reaches the actual target element that was clicked.
3. Bubbling Phase: Event bubbles up from target element -> ancestors -> window. (Default in addEventListener).

EVENT DELEGATION:
- Instead of adding 1,000 event listeners to 1,000 individual list items (<li>), attach a SINGLE event listener to their parent container (<ul>).
- Take advantage of bubbling: Read 'event.target' to identify which child was clicked.
- Benefits: Drastically reduced memory footprint, higher performance, and automatically handles newly added dynamic DOM elements without re-binding!

KEY EVENT METHODS:
- e.stopPropagation(): Halts propagation up or down the DOM tree.
- e.preventDefault(): Prevents browser default behavior (e.g. form submit reload, link navigation).
- e.stopImmediatePropagation(): Stops bubbling AND prevents other listeners on the SAME element from executing.`,
    runnableCode: `// Demonstrating Event Delegation logic
function setupDelegation(parentElement, onRowClick) {
  parentElement.addEventListener('click', (e) => {
    // Locate the closest matching child
    const row = e.target.closest('.item-row');
    if (row && parentElement.contains(row)) {
      onRowClick(row.dataset.id);
    }
  });
}
console.log("Event delegation pattern defined cleanly.");`,
    interviewerTip: "Show you understand `.closest()` inside delegation handlers—it handles clicks on child icons/spans inside a button accurately."
  },

  // ==========================================
  // 4. MACHINE CODING & ADVANCED CHALLENGES
  // ==========================================
  {
    id: "code-deep-clone-circular",
    type: "coding",
    difficulty: "Hard",
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    title: "Implement Deep Clone with Circular References & Type Handling",
    question: "Write a complete deepClone(obj) function that correctly clones primitives, arrays, plain objects, Dates, RegExps, and handles circular object graphs using WeakMap.",
    codeSnippet: `function deepClone(obj, hash = new WeakMap()) { ... }`,
    answer: `ALGORITHM DESIGN:
1. If obj is primitive or null, return directly.
2. If obj is a Date, return new Date(obj).
3. If obj is a RegExp, return new RegExp(obj.source, obj.flags).
4. Circular reference detection: Check if obj already exists in WeakMap hash. If yes, return hash.get(obj).
5. Allocate new object or array with same prototype: Object.create(Object.getPrototypeOf(obj)).
6. Store newly created clone in WeakMap hash.
7. Recursively copy own properties (including Symbols via Reflect.ownKeys).`,
    runnableCode: `function deepClone(target, hash = new WeakMap()) {
  // 1. Primitives & functions
  if (target === null || typeof target !== 'object') {
    return target;
  }

  // 2. Dates & RegExps
  if (target instanceof Date) return new Date(target.getTime());
  if (target instanceof RegExp) return new RegExp(target.source, target.flags);

  // 3. Circular reference check
  if (hash.has(target)) {
    return hash.get(target);
  }

  // 4. Create clone preserving prototype
  const clone = Array.isArray(target)
    ? []
    : Object.create(Object.getPrototypeOf(target));

  hash.set(target, clone);

  // 5. Copy all own keys (including Symbol properties)
  for (const key of Reflect.ownKeys(target)) {
    clone[key] = deepClone(target[key], hash);
  }

  return clone;
}

// Test with Circular Reference:
const original = { name: "Root" };
original.self = original; // Circular!

const cloned = deepClone(original);
console.log("Cloned successfully without call stack overflow!");
console.log("Self reference intact:", cloned.self === cloned); // true
console.log("Distinct reference from original:", cloned !== original); // true`,
    interviewerTip: "Using `Reflect.ownKeys()` instead of `Object.keys()` is what separates mid-level from principal-level engineers because it preserves Symbol keys."
  },

  {
    id: "code-flatten-nested-object",
    type: "coding",
    difficulty: "Medium",
    companies: ["Amazon", "Uber", "Microsoft", "Infosys", "Cognizant"],
    title: "Flatten a Deeply Nested Object with Dot Notation",
    question: "Convert a nested object into a flat object where keys are path strings separated by dots.",
    codeSnippet: `// Input: { user: { profile: { name: 'Rajib' }, age: 28 } }
// Output: { 'user.profile.name': 'Rajib', 'user.age': 28 }`,
    answer: `APPROACH:
1. Maintain an accumulator object.
2. Recursively traverse keys.
3. Append current key to prefix path (prefix ? prefix + '.' + key : key).
4. If property value is a non-null object and not an array, recurse. Otherwise, assign value to path.`,
    runnableCode: `function flattenObject(obj, prefix = "", result = {}) {
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const newKey = prefix ? \`\${prefix}.\${key}\` : key;

    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      flattenObject(val, newKey, result);
    } else {
      result[newKey] = val;
    }
  }
  return result;
}

const nestedData = {
  company: "CodeClouds",
  address: {
    city: "Kolkata",
    geo: { lat: 22.57, lng: 88.36 }
  },
  skills: ["JavaScript", "Node.js"]
};

console.log("Flattened Object:", flattenObject(nestedData));`,
    interviewerTip: "Ask the interviewer how arrays should be handled: either kept as arrays or transformed into `skills.0`, `skills.1`."
  },

  {
    id: "code-custom-event-emitter",
    type: "coding",
    difficulty: "Medium",
    companies: ["Google", "Meta", "Amazon", "Accenture", "TCS"],
    title: "Design a Custom EventEmitter (Pub-Sub Pattern)",
    question: "Implement an EventEmitter class supporting on(event, listener), emit(event, ...args), off(event, listener), and once(event, listener).",
    codeSnippet: `class EventEmitter {
  constructor() { ... }
  on(event, listener) { ... }
  emit(event, ...args) { ... }
  off(event, listener) { ... }
  once(event, listener) { ... }
}`,
    answer: `KEY DESIGN POINTS:
1. Store listeners in a Map: eventName -> Set/Array of callbacks.
2. on(): Appends callback to event array.
3. emit(): Calls each registered callback with provided arguments.
4. off(): Removes callback from event array.
5. once(): Wraps listener in a one-time function that automatically unregisters itself upon execution.`,
    runnableCode: `class EventEmitter {
  constructor() {
    this._events = new Map();
  }

  on(event, listener) {
    if (typeof listener !== 'function') throw new TypeError("Listener must be function");
    if (!this._events.has(event)) {
      this._events.set(event, []);
    }
    this._events.get(event).push(listener);
    return () => this.off(event, listener); // Unsubscribe helper
  }

  emit(event, ...args) {
    const listeners = this._events.get(event);
    if (!listeners || listeners.length === 0) return false;
    // Clone array to prevent mutation issues if listener unsubscribes during emit
    [...listeners].forEach(fn => fn(...args));
    return true;
  }

  off(event, listener) {
    const listeners = this._events.get(event);
    if (!listeners) return;
    this._events.set(event, listeners.filter(fn => fn !== listener && fn.originalListener !== listener));
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      listener(...args);
    };
    wrapper.originalListener = listener;
    this.on(event, wrapper);
  }
}

// Test Run
const bus = new EventEmitter();
const unsubscribe = bus.on("userLogin", (user) => console.log("Login event:", user));
bus.once("welcome", (msg) => console.log("Welcome once:", msg));

bus.emit("userLogin", "Rajib");
bus.emit("welcome", "Welcome to the App!");
bus.emit("welcome", "Will not print again"); // 'once' unregisters!
unsubscribe();
bus.emit("userLogin", "Nobody"); // Unsubscribed!`,
    interviewerTip: "Cloning `[...listeners]` before iterating in `emit` prevents skipped listeners if one listener unregisters during the loop."
  },

  {
    id: "code-lru-cache",
    type: "coding",
    difficulty: "Hard",
    companies: ["Google", "Amazon", "Microsoft", "Meta"],
    title: "Implement an LRU (Least Recently Used) Cache",
    question: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with get(key) and put(key, value) in O(1) time complexity.",
    codeSnippet: `class LRUCache {
  constructor(capacity) { ... }
  get(key) { ... }
  put(key, value) { ... }
}`,
    answer: `OPTIMAL APPROACH:
In JavaScript, the built-in ES6 'Map' preserves insertion order!
- Reading an item: Delete key and re-insert key to mark it as most recently used.
- Inserting an item: If key exists, delete first, then set.
- If capacity exceeded: Evict map.keys().next().value (the first item is always the oldest / least recently used).
Both get and put run in O(1) time complexity!`,
    runnableCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // Preserves insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    // Refresh position to make it most recently used
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // Evict least recently used (first key in map)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
      console.log(\`Evicted oldest key: \${oldestKey}\`);
    }
    this.cache.set(key, value);
  }
}

const lru = new LRUCache(2);
lru.put("a", 1);
lru.put("b", 2);
console.log("Get 'a':", lru.get("a")); // 1 (refreshes 'a')
lru.put("c", 3); // evicts 'b' because 'a' was recently accessed!
console.log("Get 'b' (should be -1):", lru.get("b")); // -1 (Evicted)
console.log("Get 'c':", lru.get("c")); // 3`,
    interviewerTip: "Explaining how ES6 Map provides O(1) access AND ordered iteration saves you from having to code a Doubly Linked List manually, while demonstrating mastery of ES6 internal data structures."
  }
];
