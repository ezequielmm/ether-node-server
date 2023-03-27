import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

interface ActionQueue<Type> {
    [key: string]: Type;
}

@Injectable()
export class ActionQueueService {
    private readonly logger: Logger = new Logger(ActionQueueService.name);

    private actionQueues: ActionQueue<Promise<void>> = {};

    async push(queueId: string, fn: () => Promise<void>) {
        if (process.env.ASYNC_MESSAGES) {
            return await fn();
        }

        if (this.actionQueues[queueId] === undefined)
            this.actionQueues[queueId] = Promise.resolve();

        this.actionQueues[queueId] = this.actionQueues[queueId]
            .then(fn)
            .catch((error) => {
                // any thrown error in the queued message will be logged. Chain will continue.
                this.logger.error(error);
            });
    }
}
