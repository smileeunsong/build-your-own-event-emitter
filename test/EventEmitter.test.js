import { test } from 'node:test';
import assert from 'node:assert';
import MyEventEmitter from '../src/EventEmitter.js';

test('emit calls registered listener', () => {
  const emitter = new MyEventEmitter();
  let called = false;

  emitter.on('test', () => {
    called = true;
  });

  emitter.emit('test');
  assert.strictEqual(called, true);
});

test('emit passes arguments to listener', () => {
  const emitter = new MyEventEmitter();
  let receivedArg;

  emitter.on('test', (arg) => {
    receivedArg = arg;
  });

  emitter.emit('test', 'hello');
  assert.strictEqual(receivedArg, 'hello');
});
