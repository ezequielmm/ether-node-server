import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

interface ActionQueue<Type> {
    [key: string]: Type;
}

@Injectable()
export class ActionQueueService {
    private readonly logger: Logger = new Logger(ActionQueueService.name);

    private actionQueues: ActionQueue<Promise<void>> = {};
    private loopWaitTime: number = 100;
    private maximumWaitTime: number = 5000;
        
    async pushWithReturn(
        queueId: string, 
        fn: () => Promise<any>, 
        maxTime: number = this.maximumWaitTime, 
        loopTime: number = this.loopWaitTime,
    ): Promise<any> {

        const wait = (ms) => new Promise(res => setTimeout(res, ms));

        const waiter = { 
            done: false, 
            data: undefined
        };
        
        await this.push(
            queueId,
            async () => {
                waiter.data = await fn();
                waiter.done = true;    
            }
        );

        let waitTime = 0;
        while (!waiter.done || waitTime < maxTime) {
            await wait(loopTime);
            waitTime += loopTime;
        }

        return (waiter.done) ? waiter.data : undefined;
    }

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
