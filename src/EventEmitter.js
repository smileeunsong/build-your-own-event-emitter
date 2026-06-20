import EventEmitter from 'node:events';

export default class MyEventEmitter extends EventEmitter {}

const myEventEmitter = new MyEventEmitter();

myEventEmitter.on('test', () => {
  console.log('new event');
});

myEventEmitter.emit('test');
