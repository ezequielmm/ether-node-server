import { Logger } from '@nestjs/common';
import { connect, Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export class ClientSocketMock {
    socket: Socket<DefaultEventsMap, DefaultEventsMap>;

    private readonly logger: Logger = new Logger(ClientSocketMock.name);

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

    public waitMessages(messages: any[], amount: number): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (messages.length === amount) {
                    resolve();
                } else {
                    this.waitMessages(messages, amount).then(resolve);
                }
            }, 5);
        });
    }

    public disconnect(): void {
        this.socket.disconnect();
    }
}
