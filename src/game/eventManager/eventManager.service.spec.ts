import { EventEmitter2 } from '@nestjs/event-emitter';
import { ActivityLogService } from '../response/activityLog.service';
import { EventManagerService } from './eventManager.service';

describe('EventManagerService', () => {
    let eventManagerService: EventManagerService;
    let eventEmitter: EventEmitter2;
    let acitvityLogService: ActivityLogService;

    beforeEach(() => {
        eventEmitter = new EventEmitter2();
        acitvityLogService = new ActivityLogService();
        eventManagerService = new EventManagerService(
            eventEmitter,
            acitvityLogService,
        );
    });

    it('should be defined', () => {
        expect(eventManagerService).toBeDefined();
    });

    it('should emit event', async () => {
        const key = 'test';
        const event = 'test';
        const args = ['test'];
        const spy = jest.spyOn(eventEmitter, 'emitAsync');
        await eventManagerService.emit(key, event, ...args);
        expect(spy).toHaveBeenCalledWith(event, ...args, {
            activityLog: acitvityLogService.findOneByClientId(key),
            emitInContext: expect.any(Function),
        });
    });

    it('should wait for all processes', async () => {
        const key = 'test';
        const event1 = 'test';
        const event2 = 'test2';
        const args = ['test'];

        eventEmitter.on(event1, async () => {
            // wait 100ms
            await new Promise((resolve) => setTimeout(resolve, 100));
            eventManagerService.emit(key, event2, ...args);
        });

        eventEmitter.on(event2, async () => {
            // wait 1s
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        eventManagerService.emit(key, event1, ...args);

        expect(eventManagerService.isProcessing(key)).toBeTruthy();
        await eventManagerService.wait(key);
        expect(eventManagerService.isProcessing(key)).toBeFalsy();
    });

    it('should wait for all processes with multiple keys', async () => {
        const key1 = 'test1';
        const key2 = 'test2';
        const event1 = 'test';
        const event2 = 'test2';
        const args = ['test'];

        eventEmitter.on(event1, async () => {
            // wait 100ms
            await new Promise((resolve) => setTimeout(resolve, 100));
            eventManagerService.emit(key2, event2, ...args);
        });

        eventEmitter.on(event2, async () => {
            // wait 1s
            await new Promise((resolve) => setTimeout(resolve, 1000));
        });

        eventManagerService.emit(key1, event1, ...args);
        eventManagerService.emit(key2, event1, ...args);

        expect(eventManagerService.isProcessing(key1)).toBeTruthy();
        expect(eventManagerService.isProcessing(key2)).toBeTruthy();
        await eventManagerService.wait(key1);
        await eventManagerService.wait(key2);
        expect(eventManagerService.isProcessing(key1)).toBeFalsy();
        expect(eventManagerService.isProcessing(key2)).toBeFalsy();
    });
});
