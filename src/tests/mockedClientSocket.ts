import { connect, Socket } from 'socket.io-client';
import {
    DefaultEventsMap,
    ReservedOrUserEventNames,
    ReservedOrUserListener,
} from 'socket.io/dist/typed-events';

export class MockedClientSocket {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;

    // add logger

    public connect(port: number): Promise<void> {
        return new Promise((resolve) => {
            this.socket = connect(`ws://[::1]:${port}`).on('connect', () => {
                console.log('client connected');
                resolve();
            });
        });
    }

    public on(event: string, callback: any) {
        this.socket.on(event, callback);
    }

    public disconnect() {
        console.log('');
    }
}
