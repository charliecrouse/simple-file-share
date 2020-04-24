import { EventEmitter } from 'events';
import http from 'http';
import socketio from 'socket.io';

import { ApplicationFactory } from './application';

class Socket {
  io: socketio.Server;
  emitter: EventEmitter;

  constructor() {
    const app = ApplicationFactory.instance.app;
    const server = http.createServer(app);
    this.io = socketio(server, { path: '/socket' });
    this.emitter = new EventEmitter();
  }

  initialize = async (): Promise<void> => {
    this.io.on('connect', (socket) => {
      const fileId: string = socket.handshake.query.fileId;

      this.emitter.on(`file-upload-progress-${fileId}`, (progress) => {
        socket.emit('file-upload-progress', progress);
      });

      this.emitter.on(`file-upload-error-${fileId}`, () => {
        socket.emit('file-upload-error');
      });

      this.emitter.on(`file-upload-complete-${fileId}`, () => {
        socket.emit('file-upload-complete');
      });

      this.emitter.on(`file-download-error-${fileId}`, () => {
        socket.emit('file-download-error');
      });
    });
  };
}

export class SocketFactory {
  static instance = new Socket();
}
