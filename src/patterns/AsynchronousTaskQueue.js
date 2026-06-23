import EventEmitter from 'node:events';

// This example shows an event emitter handling tasks that arrive at unpredictable times.
// No matter when a task is added, the worker reacts to the signal without polling or waiting.
class TaskQueue extends EventEmitter {
  constructor() {
    super();
    this.queue = [];

    this.processing = false;

    // The worker is started at construction time - always before any addTask call,
    // so no 'taskAdded' event can ever be missed.
    this.on('taskAdded', async () => {
      // If already processing, return immediately - the active while loop will
      // keep draining the queue until it's empty.
      if (this.processing) return;

      this.processing = true;

      // The while + await combination is what guarantees order.
      // If a task is async, the loop waits for it to fully resolve before picking
      // up the next one.
      while (this.queue.length) {
        const task = this.queue.shift();
        await task();
      }

      // The flag is only released once the queue is fully drained - the next
      // 'taskAdded' signal can then start a fresh loop.
      this.processing = false;
    });
  }

  addTask(task) {
    this.queue.push(task);

    // The emitter's job ends here - it only fires a "task arrived" signal and has
    // no knowledge of how or when the worker will handle it.
    this.emit('taskAdded');
  }
}

const queue = new TaskQueue();

// The queue preserves order even when tasks are async.
const task1 = async () => {
  console.log('Task 1 start');
  await new Promise((res) => setTimeout(res, 2000));
  console.log('Task 1 done');
};
const task2 = async () => {
  console.log('Task 2 start');
  await new Promise((res) => setTimeout(res, 1000));
  console.log('Task 2 done');
};

// task2 is 1 second faster than task1, but the queue ensures it only starts after
// task1 has fully resolved.
queue.addTask(task1);
queue.addTask(task2);
