import EventEmitter from 'node:events';

// This example shows an event emitter acting as the "extension point" between a core app and
// plugins. The core only emits events; plugins attach behavior by subscribing - the core's
// own code never has to change.
class Application extends EventEmitter {
  constructor() {
    super();
  }

  triggerEvent(eventName, data) {
    // The core has no idea which (or how many) plugins are attached - it just broadcasts.
    this.emit(eventName, data);
  }
}

class Plugin1 extends EventEmitter {
  constructor(app) {
    super();
    // This is where the plugin "plugs into" the core's event bus. New behavior can be added
    // from the outside without touching the core - the heart of the open-closed principle.
    app.on('someEvent', this.handleEvent.bind(this));
  }

  handleEvent(data) {
    console.log('Plugin1 received the event:', data);
  }
}

// The core instance is created first, unaware that any plugin will ever attach to it.
const app = new Application();

// The plugin receives app and subscribes itself - the core never seeks out plugins;
// plugins seek out and register with the core.
const plugin1 = new Plugin1(app);

// The moment the core emits, every plugin registered at that point reacts - the core never
// needs to know or care who's listening.
app.triggerEvent('someEvent', { message: 'Hello from app!' });
