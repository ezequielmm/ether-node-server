import { Injectable } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { Socket } from 'socket.io';
import { EnemyService } from '../components/enemy/enemy.service';
import {
    Expedition,
    ExpeditionDocument,
} from '../components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { PlayerService } from '../components/player/player.service';
import { damageEffect } from '../effects/damage/constants';
import { EffectDTO } from '../effects/effects.interface';
import { ProviderService } from '../provider/provider.service';
import { burn } from './burn/constants';
import { fortitude } from './fortitude/constants';
import { heraldDelayed } from './heraldDelayed/constants';
import {
    SourceEntityReferenceDTO,
    StatusEffectDTO,
    StatusEffectHandler,
    StatusEventDTO,
    StatusEventHandler,
    StatusEventType,
    StatusType,
} from './interfaces';
import { resolve } from './resolve/constants';
import { StatusDecorator } from './status.decorator';
import { StatusService } from './status.service';

@StatusDecorator({
    status: resolve,
})
@Injectable()
class StatusA implements StatusEffectHandler {
    preview(
        args: StatusEffectDTO<Record<string, any>>,
    ): Promise<EffectDTO<Record<string, any>>> {
        return this.handle(args);
    }

    async handle(payload: StatusEffectDTO): Promise<EffectDTO> {
        payload.effectDTO.args.status =
            (payload.effectDTO.args.status || '') + 'A';
        return payload.effectDTO;
    }
}

@StatusDecorator({
    status: fortitude,
})
@Injectable()
class StatusB implements StatusEffectHandler {
    preview(
        args: StatusEffectDTO<Record<string, any>>,
    ): Promise<EffectDTO<Record<string, any>>> {
        return this.handle(args);
    }

    async handle(payload: StatusEffectDTO): Promise<EffectDTO> {
        payload.effectDTO.args.status =
            (payload.effectDTO.args.status || '') + 'B';
        return payload.effectDTO;
    }
}

@StatusDecorator({
    status: heraldDelayed,
})
@Injectable()
class StatusC implements StatusEffectHandler {
    preview(
        args: StatusEffectDTO<Record<string, any>>,
    ): Promise<EffectDTO<Record<string, any>>> {
        return this.handle(args);
    }

    async handle(payload: StatusEffectDTO): Promise<EffectDTO> {
        payload.effectDTO.args.status =
            (payload.effectDTO.args.status || '') + 'C';
        return payload.effectDTO;
    }
}

@StatusDecorator({
    status: burn,
})
@Injectable()
class StatusEventA implements StatusEventHandler {
    args: any;
    async enemyHandler(args: StatusEventDTO): Promise<any> {
        this.args = args.status.args;
    }
}

describe('StatusService', () => {
    let service: StatusService;
    let statusEventA: StatusEventA;
    let effectDTO: EffectDTO;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                StatusService,
                StatusA,
                StatusB,
                StatusC,
                StatusEventA,
                { provide: getModelToken(Expedition.name), useValue: {} },
                { provide: ExpeditionService, useValue: {} },
                {
                    provide: EnemyService,
                    useValue: {},
                },
                {
                    provide: PlayerService,
                    useValue: {},
                },
                ProviderService,
            ],
        }).compile();

        service = module.get(StatusService);
        statusEventA = module.get(StatusEventA);
        effectDTO = {
            args: {
                initialValue: 1,
                currentValue: 1,
            },
        } as EffectDTO;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call status handle by effect name', async () => {
        const result = await service.mutate({
            ctx: {
                client: {} as Socket,
                expedition: {
                    currentNode: { data: { round: 2 } },
                } as ExpeditionDocument,
            },
            collection: {
                [StatusType.Buff]: [
                    {
                        name: resolve.name,
                        addedInRound: 1,
                        sourceReference: {} as SourceEntityReferenceDTO,
                        args: {
                            value: null,
                        },
                    },
                ],
                [StatusType.Debuff]: [],
            },
            collectionOwner: undefined,
            effect: damageEffect.name,
            effectDTO: effectDTO,
            preview: false,
        });

        expect(result.args.status).toBe('A');
    });

    it('should avoid to call status handle by effect name at the same turn', async () => {
        const result = await service.mutate({
            ctx: {
                client: undefined,
                expedition: {
                    currentNode: { data: { round: 1 } },
                } as ExpeditionDocument,
            },
            collection: {
                [StatusType.Buff]: [
                    {
                        name: resolve.name,
                        addedInRound: 1,
                        sourceReference: {} as SourceEntityReferenceDTO,
                        args: {
                            value: null,
                        },
                    },
                ],
                [StatusType.Debuff]: [],
            },
            collectionOwner: undefined,
            effect: damageEffect.name,
            effectDTO: effectDTO,
            preview: false,
        });

        expect(result.args.status).toBe(undefined);
    });

    it('should call multiple status handle by effect name', async () => {
        const result = await service.mutate({
            ctx: {
                client: undefined,
                expedition: {
                    currentNode: { data: { round: 2 } },
                } as ExpeditionDocument,
            },
            collection: {
                [StatusType.Buff]: [
                    {
                        name: fortitude.name,
                        addedInRound: 1,
                        sourceReference: {} as SourceEntityReferenceDTO,
                        args: {
                            value: null,
                        },
                    },
                    {
                        name: resolve.name,
                        addedInRound: 1,
                        sourceReference: {} as SourceEntityReferenceDTO,
                        args: {
                            value: null,
                        },
                    },
                ],
                [StatusType.Debuff]: [],
            },
            collectionOwner: undefined,
            effect: damageEffect.name,
            effectDTO: effectDTO,
            preview: false,
        });

        expect(result.args.status).toBe('A');
    });

    it('should call multiple status handle by effect name', async () => {
        const result = await service.mutate({
            ctx: {
                client: {} as Socket,
                expedition: {
                    currentNode: { data: { round: 2 } },
                } as ExpeditionDocument,
            },
            collection: {
                [StatusType.Buff]: [
                    {
                        name: fortitude.name,
                        addedInRound: 1,
                        sourceReference: {} as SourceEntityReferenceDTO,
                        args: {
                            value: null,
                        },
                    },
                    {
                        name: resolve.name,
                        addedInRound: 1,
                        sourceReference: {} as SourceEntityReferenceDTO,
                        args: {
                            value: null,
                        },
                    },
                    {
                        name: heraldDelayed.name,
                        addedInRound: 1,
                        sourceReference: {} as SourceEntityReferenceDTO,
                        args: {
                            value: null,
                        },
                    },
                ],
                [StatusType.Debuff]: [],
            },
            collectionOwner: undefined,
            effect: damageEffect.name,
            effectDTO: effectDTO,
            preview: false,
        });

        expect(result.args.status).toBe('AC');
    });

    it('should call status handle by end turn event', async () => {
        await service.trigger(
            {
                client: undefined,
                expedition: {
                    playerState: {},
                    currentNode: {
                        data: {
                            player: {
                                statuses: {
                                    [StatusType.Buff]: [],
                                    [StatusType.Debuff]: [
                                        {
                                            name: burn.name,
                                            addedInRound: 1,
                                            sourceReference: {
                                                type: 'player',
                                            },
                                            args: {
                                                value: 22,
                                            },
                                        },
                                    ],
                                },
                            },
                            enemies: [],
                        },
                    },
                } as ExpeditionDocument,
            },
            StatusEventType.OnTurnEnd,
        );

        statusEventA.args = { value: 22 };
    });
});
