import { EventUtils } from './interfaces';
import { ActivityLogService } from './../response/activityLog.service';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProccessCounter } from './processCounter';

@Injectable()
export class EventManagerService {
    private readonly processDictionary: {
        [key: string]: ProccessCounter;
    } = {};

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly activityLogService: ActivityLogService,
    ) {}

    public async emit(
        key: string,
        event: string,
        ...args: any[]
    ): Promise<void> {
        let counter = this.processDictionary[key];

        if (!counter) {
            counter = new ProccessCounter();
            this.processDictionary[key] = counter;
        }

        counter.increase();
        const eventUtils: EventUtils = {
            activityLog: this.activityLogService.findOneByClientId(key),
            emitInContext: (e, ...a) => this.emit(key, e, ...a),
        };

        await this.eventEmitter.emitAsync(event, ...args, eventUtils);

        counter.decrease();

        if (counter.isLazy()) {
            delete this.processDictionary[key];
        }
    }

    public async wait(key): Promise<void> {
        return new Promise((resolve, reject) => {
            const counter = this.processDictionary[key];
            if (!counter) {
                reject();
            } else {
                counter.onChange(() => {
                    if (counter.isLazy()) {
                        resolve();
                    }
                });
            }
        });
    }

    public isProcessing(key: string): boolean {
        const counter = this.processDictionary[key];
        if (!counter) {
            return false;
        }
        return counter.isProcessing();
    }
}
