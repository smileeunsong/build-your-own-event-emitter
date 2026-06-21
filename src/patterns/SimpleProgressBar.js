import EventEmitter from 'node:events';

// This example shows how an event emitter can broadcast a task's lifecycle so that a UI
// like a progress bar simply listens - Task and UI never need to know about each other.
class Task extends EventEmitter {
  constructor() {
    super();
  }

  start() {
    // Signals that work has begun - Task broadcasts this without caring who's listening.
    this.emit('started');

    setTimeout(() => {
      // The same 'progress' event fires repeatedly with a new value, letting subscribers refresh each tick.
      this.emit('progress', 50);

      setTimeout(() => {
        this.emit('progress', 100);

        // Marks the end of the lifecycle - no further events are emitted after this in this example.
        this.emit('completed');
      }, 1000);
    }, 2000);
  }
}

const task = new Task();

// A progress bar can react without knowing Task's internals - it only needs
// the event name. This loose coupling is the core value of the event emitter pattern.
task.on('started', () => console.log('Task started.'));
task.on('progress', (p) => console.log(`Current progress: ${p}%`));
task.on('completed', () => console.log('Task completed successfully.'));

task.start();
