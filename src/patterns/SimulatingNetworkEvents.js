import EventEmitter from 'node:events';

class MockSocket extends EventEmitter {
  constructor() {
    super();
  }

  connect() {
    this.emit('connect');

    // mock response after 1 second
    setTimeout(() => {
      this.emit('data', { message: 'fake response' });
    }, 1000);
  }
}

const socket = new MockSocket();

socket.on('connect', () => {
  console.log('socket connected');
});

socket.on('data', (data) => {
  console.log('received data:', data);
});

socket.connect();
