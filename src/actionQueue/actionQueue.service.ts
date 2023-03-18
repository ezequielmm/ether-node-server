import { Injectable } from '@nestjs/common';

interface ActionQueue<Type> {
    [key: string]: Type;
}

@Injectable()
export class ActionQueueService {
    private actionQueues: ActionQueue<Promise<void>> = {};

    public async push(queueId: string, fn: () => Promise<void>) {
        if (this.actionQueues[queueId] === undefined)
            this.actionQueues[queueId] = Promise.resolve();

        this.actionQueues[queueId] = this.actionQueues[queueId].then(fn);
    }
}
