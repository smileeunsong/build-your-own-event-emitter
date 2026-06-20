import assert from 'node:assert';
import { describe, it } from 'node:test';
import MyEventEmitter from '../src/EventEmitter.js';

describe('MyEventEmitter', () => {
  describe('on/emit', () => {
    it('calls the registered listener when emitted', () => {
      const emitter = new MyEventEmitter();
      let called = false;

      emitter.on('test', () => {
        called = true;
      });
      emitter.emit('test');

      assert.strictEqual(called, true);
    });

    it('passes the emitted arguments to the listener', () => {
      const emitter = new MyEventEmitter();
      let received;

      emitter.on('test', (arg) => {
        received = arg;
      });
      emitter.emit('test', 'hello');

      assert.strictEqual(received, 'hello');
    });

    it('calls all listeners registered for the same event', () => {
      const emitter = new MyEventEmitter();
      const calls = [];

      emitter.on('test', () => calls.push('a'));
      emitter.on('test', () => calls.push('b'));
      emitter.emit('test');

      assert.deepStrictEqual(calls, ['a', 'b']);
    });

    it('returns false when emitting an event with no listeners', () => {
      const emitter = new MyEventEmitter();
      const result = emitter.emit('nope');

      assert.strictEqual(result, false);
    });

    it('returns true when emitting an event that has listeners', () => {
      const emitter = new MyEventEmitter();
      emitter.on('test', () => {});
      const result = emitter.emit('test');

      assert.strictEqual(result, true);
    });
  });

  describe('once', () => {
    it('calls a once listener only one time', () => {
      const emitter = new MyEventEmitter();
      let count = 0;

      emitter.once('test', () => {
        count++;
      });
      emitter.emit('test');
      emitter.emit('test');

      assert.strictEqual(count, 1);
    });

    it('passes arguments to a once listener correctly', () => {
      const emitter = new MyEventEmitter();
      let received;

      emitter.once('test', (arg) => {
        received = arg;
      });
      emitter.emit('test', 'payload');

      assert.strictEqual(received, 'payload');
    });
  });

  describe('off', () => {
    it('removes a registered listener so it no longer fires', () => {
      const emitter = new MyEventEmitter();
      let called = false;
      const handler = () => {
        called = true;
      };

      emitter.on('test', handler);
      emitter.off('test', handler);
      emitter.emit('test');

      assert.strictEqual(called, false);
    });

    it('removes only one instance when the same function is registered twice', () => {
      const emitter = new MyEventEmitter();
      let count = 0;
      const handler = () => {
        count++;
      };

      emitter.on('test', handler);
      emitter.on('test', handler);
      emitter.off('test', handler);
      emitter.emit('test');

      // only 1 of the 2 registered instances was removed
      assert.strictEqual(count, 1);
    });

    it('does not throw when called with an unregistered event', () => {
      const emitter = new MyEventEmitter();

      assert.doesNotThrow(() => {
        emitter.off('nope', () => {});
      });
    });
  });

  describe('chaining', () => {
    it('returns this from on, off, and once for chaining', () => {
      const emitter = new MyEventEmitter();
      const handler = () => {};

      const result = emitter
        .on('a', handler)
        .off('a', handler)
        .once('b', handler);

      assert.strictEqual(result, emitter);
    });
  });

  describe('multiple event names', () => {
    it('keeps listeners for different events independent', () => {
      const emitter = new MyEventEmitter();
      const calls = [];

      emitter.on('foo', () => calls.push('foo'));
      emitter.on('bar', () => calls.push('bar'));

      emitter.emit('foo');

      assert.deepStrictEqual(calls, ['foo']);
    });

    it('stores listeners for each eventName in separate buckets', () => {
      const emitter = new MyEventEmitter();

      emitter.on('foo', () => {});
      emitter.on('bar', () => {});
      emitter.on('bar', () => {});

      assert.strictEqual(emitter.listeners['foo'].length, 1);
      assert.strictEqual(emitter.listeners['bar'].length, 2);
    });

    it('emitting one event does not trigger listeners registered on another', () => {
      const emitter = new MyEventEmitter();
      let fooCalled = false;
      let barCalled = false;

      emitter.on('foo', () => {
        fooCalled = true;
      });
      emitter.on('bar', () => {
        barCalled = true;
      });

      emitter.emit('foo');

      assert.strictEqual(fooCalled, true);
      assert.strictEqual(barCalled, false);
    });
  });
});
