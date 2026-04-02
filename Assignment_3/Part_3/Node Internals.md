# Part 3: Node.js Internals

## 1. What is the Node.js Event Loop?

The Event Loop is the core mechanism that allows Node.js to perform non-blocking I/O operations. It continuously checks the call stack and the callback queue. If the call stack is empty, it takes callbacks from the queue and pushes them to the stack for execution.

**Key Idea:**

* Enables asynchronous, non-blocking behavior
* Runs in a single thread

---

## 2. What is Libuv and What Role Does It Play in Node.js?

Libuv is a C library that provides Node.js with asynchronous I/O capabilities. It handles operations like file system access, networking, and the thread pool.

**Role of Libuv:**

* Implements the Event Loop
* Manages thread pool
* Handles async I/O operations

---

## 3. How Does Node.js Handle Asynchronous Operations Under the Hood?

When an async task (like reading a file) is requested:

1. Node.js delegates it to Libuv
2. Libuv handles it using the OS or thread pool
3. Once complete, the callback is pushed to the callback queue
4. Event loop moves it to the call stack when ready

---

## 4. Difference Between Call Stack, Event Queue, and Event Loop

### Call Stack

* Executes synchronous code
* Follows LIFO (Last In, First Out)

### Event Queue (Callback Queue)

* Stores callbacks from async operations

### Event Loop

* Moves callbacks from queue → call stack when stack is empty

---

## 5. What is the Node.js Thread Pool and How to Set Its Size?

The thread pool is used by Libuv to handle heavy operations like file system tasks, DNS, and crypto.

**Default size:** 4 threads

**To change size:**

```bash
UV_THREADPOOL_SIZE=8 node app.js
```

---

## 6. How Does Node.js Handle Blocking vs Non-Blocking Code?

### Blocking Code

* Runs synchronously
* Stops execution until finished

Example:

```javascript
fs.readFileSync('file.txt');
```

### Non-Blocking Code

* Runs asynchronously
* Does not block execution

Example:

```javascript
fs.readFile('file.txt', (err, data) => {
  console.log(data);
});
```

**Summary:**

* Blocking = slow, stops everything
* Non-blocking = efficient, s
