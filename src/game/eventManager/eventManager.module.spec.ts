import { EventUtils } from './interfaces/index';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { EventManagerModule } from './eventManager.module';
import { EventManagerService } from './eventManager.service';

@Injectable()
class EventConsumer {
    public eventPayload: any;

    @OnEvent('event')
    async event(payload, eventUtils: EventUtils) {
        this.eventPayload = payload;
        eventUtils.emitInContext('event.2', payload);
    }
}

@Injectable()
class EventConsumer2 {
    public eventPayload: any;

    @OnEvent('event.2')
    async event(payload) {
        // Await 1s
        await new Promise((resolve) => setTimeout(resolve, 1000));
        this.eventPayload = payload;
    }
}

@Injectable()
class EventProducer implements OnApplicationBootstrap {
    constructor(private readonly eventManagerService: EventManagerService) {}

    onApplicationBootstrap() {
        this.eventManagerService.emit('key', 'event', { payload: 'test' });
    }
}

describe('EventManagerModule', () => {
    let app;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [EventManagerModule],
            providers: [EventConsumer, EventConsumer2, EventProducer],
        }).compile();

        app = module.createNestApplication();
    });

    it('should event payload be undefined', async () => {
        await app.init();

        const consumer = app.get(EventConsumer);
        const consumer2 = app.get(EventConsumer2);

        expect(consumer.eventPayload).toEqual({ payload: 'test' });
        expect(consumer2.eventPayload).toEqual(undefined);
    });

    it('should wait for all processes to be finished', async () => {
        await app.init();

        const consumer = app.get(EventConsumer);
        const consumer2 = app.get(EventConsumer2);
        const ems = app.get(EventManagerService);

        await ems.wait('key');

        expect(consumer.eventPayload).toEqual({ payload: 'test' });
        expect(consumer2.eventPayload).toEqual({ payload: 'test' });
    });
});
