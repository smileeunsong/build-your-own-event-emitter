export default class MyEventEmitter {
  listeners = {}; // { eventName: [fn, fn, fn] }

  on(eventName, fn) {
    // if eventName is not in listeners, create an empty array
    this.listeners[eventName] = this.listeners[eventName] || [];
    this.listeners[eventName].push(fn);

    return this;
  }

  once(eventName, fn) {
    this.listeners[eventName] = this.listeners[eventName] || [];
    const onceWrapper = (...args) => {
      fn(...args); // deliver the arguments to original function
      this.off(eventName, onceWrapper); // self-destruct after the first call
    };
    this.listeners[eventName].push(onceWrapper);

    return this;
  }

  off(eventName, fn) {
    let lis = this.listeners[eventName];

    if (!lis) return this;

    for (let i = lis.length - 1; i >= 0; i--) {
      if (lis[i] === fn) {
        lis.splice(i, 1);
        break;
      }
    }

    return this;
  }

  emit(eventName, ...args) {
    let fns = this.listeners[eventName];

    if (!fns) return false;

    fns.forEach((fn) => {
      fn(...args);
    });

    return true;
  }
}
