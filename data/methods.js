/**
 * Complete JavaScript Methods Encyclopedia
 * Categorized by: Array, String, Object, Promise, Function, Math & Number, Map & Set.
 * Each method contains: Formal Syntax, Parameters, Return Type, Mutability, and Clear Simple Example.
 */

export const JS_METHODS = [
  // ==========================================
  // ARRAY METHODS
  // ==========================================
  {
    category: "Array",
    name: "map()",
    syntax: "array.map(callback(currentValue, index, array), thisArg)",
    parameters: "callback: function executed on each element; thisArg: optional value for 'this'",
    returnType: "A NEW Array of the same length containing transformed elements",
    mutates: "No (Pure)",
    description: "Takes every item in the array, applies your function to it, and gives you back a brand new array with the transformed items.",
    simpleExample: `// Simple: Double every number
const numbers = [1, 2, 3, 4];
const doubled = numbers.map(num => num * 2);

console.log("Original:", numbers); // [1, 2, 3, 4] (not changed)
console.log("Doubled:", doubled);   // [2, 4, 6, 8]`,
    interviewTip: "map() ALWAYS returns an array of the exact same length. If you return nothing inside the callback, you get an array of [undefined, undefined]."
  },

  {
    category: "Array",
    name: "filter()",
    syntax: "array.filter(callback(element, index, array), thisArg)",
    parameters: "callback: test function returning truthy (keep item) or falsy (discard item)",
    returnType: "A NEW Array containing only the items that passed the test",
    mutates: "No (Pure)",
    description: "Filters an array like a coffee filter. Only items where your function returns true will make it into the new array.",
    simpleExample: `// Simple: Keep only even numbers
const ages = [12, 18, 25, 8, 30];
const adults = ages.filter(age => age >= 18);

console.log("Adults only:", adults); // [18, 25, 30]`,
    interviewTip: "filter() does not change the original array. If no elements pass, it returns an empty array []."
  },

  {
    category: "Array",
    name: "reduce()",
    syntax: "array.reduce(callback(accumulator, currentValue, index, array), initialValue)",
    parameters: "callback: function that calculates next accumulated value; initialValue: starting value",
    returnType: "The single final accumulated value (can be number, string, object, array)",
    mutates: "No (Pure)",
    description: "Rolls up or combines all elements of an array into one single value (like summing numbers or grouping items into an object).",
    simpleExample: `// Simple: Sum up all numbers starting from 0
const cartPrices = [10, 20, 30];
const total = cartPrices.reduce((accumulator, price) => {
  return accumulator + price;
}, 0); // 0 is initialValue

console.log("Total Bill:", total); // 60`,
    interviewTip: "Always provide initialValue! If omitted, reduce takes index 0 as initial value and starts loop at index 1, which throws TypeError on empty arrays."
  },

  {
    category: "Array",
    name: "find() & findIndex()",
    syntax: "array.find(callback)\narray.findIndex(callback)",
    parameters: "callback: testing function",
    returnType: "find: the first matching element (or undefined)\nfindIndex: the index number (or -1)",
    mutates: "No (Pure)",
    description: "Searches the array from left to right and stops the moment it finds the first match.",
    simpleExample: `const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
];

const found = users.find(u => u.id === 2);
const foundIndex = users.findIndex(u => u.id === 2);

console.log("Found user:", found);       // { id: 2, name: "Bob" }
console.log("Found at index:", foundIndex); // 1`,
    interviewTip: "find() stops searching immediately upon finding the first match (short-circuits for performance)."
  },

  {
    category: "Array",
    name: "some() & every()",
    syntax: "array.some(callback)\narray.every(callback)",
    parameters: "callback: testing condition function",
    returnType: "Boolean (true or false)",
    mutates: "No (Pure)",
    description: "some() checks if AT LEAST ONE item satisfies condition. every() checks if ALL items satisfy condition.",
    simpleExample: `const scores = [45, 80, 95, 30];

// Is at least one score passing (>= 50)?
const hasPassing = scores.some(s => s >= 50); // true

// Did everyone pass?
const allPassed = scores.every(s => s >= 50); // false

console.log("At least one passed:", hasPassing);
console.log("All passed:", allPassed);`,
    interviewTip: "Both methods short-circuit! some() stops on first true; every() stops on first false."
  },

  {
    category: "Array",
    name: "includes(), indexOf() & lastIndexOf()",
    syntax: "array.includes(value, fromIndex)\narray.indexOf(value, fromIndex)",
    parameters: "value: element to search for; fromIndex: starting position",
    returnType: "includes: boolean | indexOf: index integer or -1",
    mutates: "No (Pure)",
    description: "Checks if a simple primitive value exists in the array.",
    simpleExample: `const fruits = ["apple", "banana", "mango", "banana"];

console.log(fruits.includes("mango"));     // true
console.log(fruits.includes("orange"));    // false
console.log(fruits.indexOf("banana"));     // 1 (first occurrence)
console.log(fruits.lastIndexOf("banana")); // 3 (last occurrence)`,
    interviewTip: "includes() can detect NaN inside an array ([NaN].includes(NaN) is true), but indexOf([NaN], NaN) returns -1!"
  },

  {
    category: "Array",
    name: "slice() vs splice()",
    syntax: "array.slice(start, end)\narray.splice(start, deleteCount, ...itemsToAdd)",
    parameters: "slice: start and end index (end not included)\nsplice: start index, count to delete, optional items to insert",
    returnType: "slice: NEW array copy | splice: array of REMOVED items",
    mutates: "slice: NO (Pure) | splice: YES (MUTATES original array)",
    description: "slice() cuts a copy without touching original. splice() cuts into the original array to delete or insert items.",
    simpleExample: `const animals = ["cat", "dog", "elephant", "tiger"];

// slice (non-mutating): copy index 1 to 3
const copy = animals.slice(1, 3);
console.log("Sliced copy:", copy);       // ["dog", "elephant"]
console.log("Original animals:", animals); // Unchanged!

// splice (MUTATES original): delete 1 item at index 1 and insert 'wolf'
const removed = animals.splice(1, 1, "wolf");
console.log("Removed item:", removed);     // ["dog"]
console.log("Mutated animals:", animals);  // ["cat", "wolf", "elephant", "tiger"]`,
    interviewTip: "One of the most common MNC interview questions! Remember: SLICE is safe (returns slice of bread), SPLICE is destructive (surgery on the original array)."
  },

  {
    category: "Array",
    name: "toSorted(), toReversed(), toSpliced(), with() [ES2023]",
    syntax: "arr.toSorted(compareFn)\narr.toReversed()\narr.toSpliced(start, count, ...items)\narr.with(index, value)",
    parameters: "Same parameters as sort, reverse, splice, with index & value",
    returnType: "A BRAND NEW Array with changes applied",
    mutates: "No (100% Pure, Non-mutating)",
    description: "The modern ES2023 counterparts to sort, reverse, and splice that do NOT destroy or mutate your original array.",
    simpleExample: `const original = [3, 1, 4, 2];

// toSorted() creates a sorted copy
const sortedCopy = original.toSorted((a, b) => a - b);
console.log("Original array:", original);     // [3, 1, 4, 2] (safe!)
console.log("Sorted copy:", sortedCopy);       // [1, 2, 3, 4]

// with(index, newValue) replaces one item immutably
const replacedCopy = original.with(0, 99);
console.log("With index 0 replaced:", replacedCopy); // [99, 1, 4, 2]`,
    interviewTip: "Mentioning ES2023 non-mutating methods proves your knowledge is up-to-date with modern production standards."
  },

  {
    category: "Array",
    name: "flat() & flatMap()",
    syntax: "array.flat(depth)\narray.flatMap(callback)",
    parameters: "depth: how many nested levels to flatten (default 1); callback for flatMap",
    returnType: "A NEW flattened Array",
    mutates: "No (Pure)",
    description: "flat() flattens nested arrays. flatMap() maps each item and then flattens the result by 1 level in a single efficient pass.",
    simpleExample: `const nested = [1, [2, [3, 4]]];
console.log("Flat depth 1:", nested.flat(1));        // [1, 2, [3, 4]]
console.log("Flat depth Infinity:", nested.flat(Infinity)); // [1, 2, 3, 4]

// flatMap example: split sentences into words
const sentences = ["Hello world", "JavaScript is fun"];
const words = sentences.flatMap(s => s.split(" "));
console.log("All words:", words); // ['Hello', 'world', 'JavaScript', 'is', 'fun']`,
    interviewTip: "flatMap() is identical to map() followed by flat(1), but is significantly faster as it avoids allocating an intermediate array."
  },

  // ==========================================
  // STRING METHODS
  // ==========================================
  {
    category: "String",
    name: "slice(), substring() & trim()",
    syntax: "str.slice(start, end)\nstr.substring(start, end)\nstr.trim()",
    parameters: "start, end index; trim removes whitespace from both ends",
    returnType: "A NEW String (Strings are primitive & immutable in JS)",
    mutates: "No (Strings can NEVER be mutated in JavaScript)",
    description: "Extract parts of a string or clean up spaces from user inputs.",
    simpleExample: `const text = "  Hello JavaScript!  ";

console.log("Trimmed:", text.trim()); // "Hello JavaScript!"
console.log("Slice(2, 7):", text.trim().slice(0, 5)); // "Hello"`,
    interviewTip: "Remember: Strings in JavaScript are immutable. No string method ever mutates the original string; they always return a new string."
  },

  {
    category: "String",
    name: "split() & join()",
    syntax: "str.split(separator, limit)\narr.join(separator)",
    parameters: "separator: character or regex to split or join on",
    returnType: "split: Array of strings | join: single String",
    mutates: "No (Pure)",
    description: "split() breaks a string into an array. join() glues array items back into a single string.",
    simpleExample: `const csv = "apple,banana,mango";
const fruitList = csv.split(",");
console.log("Array:", fruitList); // ['apple', 'banana', 'mango']

const reconnected = fruitList.join(" - ");
console.log("Joined string:", reconnected); // "apple - banana - mango"`,
    interviewTip: "Reverse a string one-liner trick: str.split('').reverse().join('')."
  },

  {
    category: "String",
    name: "replace() & replaceAll()",
    syntax: "str.replace(target, replacement)\nstr.replaceAll(target, replacement)",
    parameters: "target: string or RegExp to find; replacement: string or function",
    returnType: "A NEW String with replacements applied",
    mutates: "No (Pure)",
    description: "replace() replaces only the first occurrence. replaceAll() replaces every single match.",
    simpleExample: `const text = "cat, dog, cat, bird";

console.log(text.replace("cat", "tiger"));    // "tiger, dog, cat, bird" (only 1st)
console.log(text.replaceAll("cat", "tiger")); // "tiger, dog, tiger, bird" (all)`,
    interviewTip: "Before replaceAll() was added in ES2021, developers had to use regular expressions with global flag: str.replace(/cat/g, 'tiger')."
  },

  {
    category: "String",
    name: "includes(), startsWith() & endsWith()",
    syntax: "str.includes(searchStr)\nstr.startsWith(searchStr)\nstr.endsWith(searchStr)",
    parameters: "searchStr: substring to look for",
    returnType: "Boolean (true or false)",
    mutates: "No (Pure)",
    description: "Fast, readable checks for whether a string contains or begins/ends with a piece of text.",
    simpleExample: `const filename = "invoice_2026.pdf";

console.log(filename.includes("2026"));   // true
console.log(filename.startsWith("invoice")); // true
console.log(filename.endsWith(".pdf"));    // true`,
    interviewTip: "All these methods are case-sensitive! 'Invoice'.startsWith('invoice') is false."
  },

  // ==========================================
  // OBJECT METHODS
  // ==========================================
  {
    category: "Object",
    name: "Object.keys(), Object.values() & Object.entries()",
    syntax: "Object.keys(obj)\nObject.values(obj)\nObject.entries(obj)",
    parameters: "obj: object to inspect",
    returnType: "keys: string[] | values: any[] | entries: [key, value][]",
    mutates: "No (Pure)",
    description: "Extracts an object's keys, values, or key-value pairs as iterable arrays.",
    simpleExample: `const user = { name: "Rajib", role: "Developer", xp: 5 };

console.log("Keys:", Object.keys(user));     // ['name', 'role', 'xp']
console.log("Values:", Object.values(user)); // ['Rajib', 'Developer', 5]
console.log("Entries:", Object.entries(user));
// [ ['name', 'Rajib'], ['role', 'Developer'], ['xp', 5] ]`,
    interviewTip: "Object.entries() is commonly paired with for...of or Array.prototype.map to transform objects."
  },

  {
    category: "Object",
    name: "Object.assign() & Object.fromEntries()",
    syntax: "Object.assign(target, ...sources)\nObject.fromEntries(iterable)",
    parameters: "assign: target object and sources; fromEntries: iterable of [key, value] pairs",
    returnType: "assign: modified target object | fromEntries: a brand new Object",
    mutates: "Object.assign MUTATES target! Pass {} as first arg to keep it pure.",
    description: "Object.assign merges objects. Object.fromEntries turns an array of [key, value] pairs back into an object.",
    simpleExample: `// Merging objects cleanly without mutating
const defaults = { theme: "light", notifications: true };
const userPrefs = { theme: "dark" };

const settings = Object.assign({}, defaults, userPrefs);
console.log("Merged settings:", settings); // { theme: 'dark', notifications: true }

// fromEntries: turn pairs back into object
const pairs = [["id", 101], ["status", "active"]];
const objFromPairs = Object.fromEntries(pairs);
console.log("Created object:", objFromPairs); // { id: 101, status: 'active' }`,
    interviewTip: "Modern JavaScript usually prefers the object spread operator ({ ...defaults, ...userPrefs }) over Object.assign for clarity."
  },

  {
    category: "Object",
    name: "Object.freeze() vs Object.seal()",
    syntax: "Object.freeze(obj)\nObject.seal(obj)",
    parameters: "obj: target object to lock down",
    returnType: "The locked down object",
    mutates: "Yes (mutates object extensibility state in place)",
    description: "freeze() makes an object 100% read-only (no adding, deleting, or modifying values). seal() allows modifying existing values but prevents adding or deleting properties.",
    simpleExample: `const config = Object.freeze({ apiUrl: "https://api.com" });
// config.apiUrl = "https://hacked.com"; // Silently fails or throws in strict mode!
console.log("Frozen config:", config.apiUrl); // Still "https://api.com"

const user = Object.seal({ name: "Rajib", age: 28 });
user.age = 29; // Allowed! Modifying existing key works.
// delete user.name; // Not allowed! Cannot delete.
console.log("Sealed user:", user);`,
    interviewTip: "Both Object.freeze and Object.seal are SHALLOW! Nested objects are not frozen unless you recursively freeze them (Deep Freeze)."
  },

  {
    category: "Object",
    name: "Object.groupBy() [ES2024]",
    syntax: "Object.groupBy(items, callback(item, index))",
    parameters: "items: iterable; callback: returns the group key string",
    returnType: "A null-prototype object containing grouped arrays",
    mutates: "No (Pure)",
    description: "Natively groups elements of an array by a category or property without needing Lodash or manual reduce.",
    simpleExample: `const people = [
  { name: "Alice", role: "admin" },
  { name: "Bob", role: "user" },
  { name: "Charlie", role: "admin" }
];

const grouped = Object.groupBy(people, p => p.role);
console.log("Grouped by role:", grouped);
// Output:
// {
//   admin: [ { name: "Alice", ... }, { name: "Charlie", ... } ],
//   user:  [ { name: "Bob", ... } ]
// }`,
    interviewTip: "Object.groupBy returns an object with a null prototype (Object.create(null)) to avoid accidental property collision."
  },

  // ==========================================
  // PROMISE METHODS
  // ==========================================
  {
    category: "Promise",
    name: "Promise.all(), allSettled(), race(), any()",
    syntax: "Promise.all([p1, p2])\nPromise.allSettled([p1, p2])\nPromise.race([p1, p2])\nPromise.any([p1, p2])",
    parameters: "Iterable containing Promises or raw values",
    returnType: "A new Promise resolving with combined values according to combinator rule",
    mutates: "No",
    description: "Coordinates multiple asynchronous requests concurrently.",
    simpleExample: `const fast = new Promise(res => setTimeout(() => res("Fast!"), 100));
const slow = new Promise(res => setTimeout(() => res("Slow!"), 300));

// Wait for all to finish
Promise.all([fast, slow]).then(results => {
  console.log("Promise.all:", results); // ['Fast!', 'Slow!']
});

// First one to complete wins
Promise.race([fast, slow]).then(winner => {
  console.log("Promise.race winner:", winner); // 'Fast!'
});`,
    interviewTip: "Difference between all and allSettled: all rejects immediately if any 1 fails (fail-fast); allSettled waits for all promises regardless of success or failure."
  },

  // ==========================================
  // FUNCTION METHODS
  // ==========================================
  {
    category: "Function",
    name: "call(), apply() & bind()",
    syntax: "fn.call(thisArg, arg1, arg2)\nfn.apply(thisArg, [arg1, arg2])\nfn.bind(thisArg, arg1)",
    parameters: "thisArg: object to bind 'this' to; arguments separated (call) or array (apply)",
    returnType: "call/apply: function return value | bind: brand new permanently-bound Function",
    mutates: "No",
    description: "Manually controls what 'this' points to when executing a function.",
    simpleExample: `function introduce(greeting, punct) {
  return \`\${greeting}, I am \${this.name}\${punct}\`;
}

const person = { name: "Rajib" };

// call: arguments passed comma-separated
console.log(introduce.call(person, "Hello", "!")); // "Hello, I am Rajib!"

// apply: arguments passed as an Array
console.log(introduce.apply(person, ["Hi", "."])); // "Hi, I am Rajib."

// bind: returns a new function with person bound forever
const boundIntro = introduce.bind(person, "Namaste");
console.log(boundIntro("!!")); // "Namaste, I am Rajib!!"`,
    interviewTip: "Easy memory trick: CALL takes Comma separated args; APPLY takes an Array of args; BIND creates a Brand new function."
  },

  // ==========================================
  // MAP & SET METHODS
  // ==========================================
  {
    category: "Map & Set",
    name: "Map: set(), get(), has(), delete()",
    syntax: "map.set(key, value)\nmap.get(key)\nmap.has(key)\nmap.delete(key)",
    parameters: "key: ANY type (objects, functions, numbers, strings); value: any type",
    returnType: "set: Map | get: value | has/delete: boolean",
    mutates: "Yes (mutates Map instance)",
    description: "Map is a key-value collection where keys can be objects (unlike regular Objects where keys are coerced to strings).",
    simpleExample: `const map = new Map();
const userObjKey = { id: 1 };

map.set(userObjKey, "Senior Developer");
console.log("Has key?", map.has(userObjKey)); // true
console.log("Get value:", map.get(userObjKey)); // "Senior Developer"
console.log("Size:", map.size); // 1`,
    interviewTip: "Why use Map over Object? 1. Keys can be objects/functions; 2. Maintains insertion order; 3. Has native .size property; 4. Faster for frequent additions/deletions."
  },

  {
    category: "Map & Set",
    name: "Set: add(), has(), delete() & Array Deduplication",
    syntax: "set.add(value)\nset.has(value)\nset.delete(value)",
    parameters: "value: unique value to store",
    returnType: "add: Set | has/delete: boolean",
    mutates: "Yes (mutates Set instance)",
    description: "Set stores unique values only. Any duplicate added is automatically discarded.",
    simpleExample: `const duplicates = [1, 2, 2, 3, 4, 4, 5];

// Remove all duplicates in 1 line:
const uniqueArray = [...new Set(duplicates)];
console.log("Unique numbers:", uniqueArray); // [1, 2, 3, 4, 5]`,
    interviewTip: "Set value lookup with .has() runs in O(1) constant time, compared to array.includes() which runs in O(n) linear time."
  }
];
