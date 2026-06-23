import EventEmitter from 'node:events';

// This example shows an event emitter syncing a single source of truth (the Store) with
// multiple view components. Whenever state changes, the Store broadcasts a signal, and any
// listening component re-renders itself off that one signal alone.
class Store extends EventEmitter {
  constructor(initialState) {
    super();
    // Just storing the initial state - no event has fired yet.
    this.state = initialState;
  }

  getState() {
    // Subscribers pull the "current" state through this method, independent of whatever
    // payload a given emit happened to carry.
    return this.state;
  }

  setState(newState) {
    // State mutation and event emission are bundled in one method, guaranteeing that a
    // state change is never silently missed by subscribers.
    this.state = newState;
    this.emit('stateChange', this.state);
  }
}

const store = new Store({ count: 0 });

// Neither component knows about the other, or about the Store's internals -
// each only needs getState().
const component1 = {
  render() {
    console.log('Component 1 output count:', store.getState().count);
  },
};

const component2 = {
  render() {
    console.log('Component 2 output count:', store.getState().count);
  },
};

// One subscription fans out to multiple components re-rendering - a "single signal,
// multiple reactions" structure. This is how components stay in sync without prop drilling.
store.on('stateChange', () => {
  component1.render();
  component2.render();
});

// This single call triggers both the data update and the view updates - components have
// no idea who changed the state or why, they just reflect whatever is current.
store.setState({ count: 1 });
