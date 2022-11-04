import { Logger } from '@nestjs/common';
import { connect, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export class MockedClientSocket {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;

    private readonly logger: Logger = new Logger(MockedClientSocket.name);

    public connect(port: number): Promise<void> {
        return new Promise((resolve) => {
            this.socket = connect(`ws://[::1]:${port}`).on('connect', () => {
                Logger.debug('client connected');
                resolve();
            });
        });
    }

    public on(event: string, callback: any): void {
        this.socket.on(event, callback);
    }

    public disconnect(): void {
        this.socket.disconnect();
    }
}
