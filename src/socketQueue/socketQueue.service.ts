import { Injectable } from '@nestjs/common';

@Injectable()
export class SocketQueueService {
    private readonly queue: Array<() => Promise<void>> = [];

    public async push(fn: () => Promise<void>): Promise<void> {
        this.queue.push(fn);
    }

    public async run(): Promise<void> {
        const fn = this.queue.shift();

        if (fn) await fn();
    }
}
