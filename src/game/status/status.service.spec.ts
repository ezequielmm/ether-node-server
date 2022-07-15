import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EffectDTO } from '../effects/effects.interface';
import { StatusEffectHandler, StatusEffectDTO, StatusType } from './interfaces';
import { StatusService } from './status.service';
import { getModelToken } from '@nestjs/mongoose';
import { Expedition } from '../components/expedition/expedition.schema';
import { StatusDecorator } from './status.decorator';
import { resolve } from './resolve/constants';
import { fortitude } from './fortitude/constants';
import { damageEffect } from '../effects/constants';
import { heraldDelayed } from './heraldDelayed/constants';
import { SourceEntityReferenceDTO } from '../components/expedition/expedition.interface';
import { ExpeditionService } from '../components/expedition/expedition.service';

@StatusDecorator({
    status: resolve,
})
@Injectable()
class StatusA implements StatusEffectHandler {
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
    async handle(payload: StatusEffectDTO): Promise<EffectDTO> {
        payload.effectDTO.args.status =
            (payload.effectDTO.args.status || '') + 'C';
        return payload.effectDTO;
    }
}

describe('StatusService', () => {
    let statusService: StatusService;
    let effectDTO: EffectDTO;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                StatusService,
                StatusA,
                StatusB,
                StatusC,
                { provide: getModelToken(Expedition.name), useValue: {} },
                { provide: ExpeditionService, useValue: {} },
            ],
        }).compile();

        statusService = module.get(StatusService);
        effectDTO = {
            args: {
                initialValue: 1,
                currentValue: 1,
            },
        } as EffectDTO;
    });

    it('should be defined', () => {
        expect(statusService).toBeDefined();
    });

    it('should call status handle by effect name', async () => {
        const result = await statusService.mutateEffects({
            expedition: { currentNode: { data: { round: 2 } } } as Expedition,
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
        });

        expect(result.args.status).toBe('A');
    });

    it('should avoid to call status handle by effect name at the same turn', async () => {
        const result = await statusService.mutateEffects({
            expedition: { currentNode: { data: { round: 1 } } } as Expedition,
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
        });

        expect(result.args.status).toBe(undefined);
    });

    it('should call multiple status handle by effect name', async () => {
        const result = await statusService.mutateEffects({
            expedition: { currentNode: { data: { round: 2 } } } as Expedition,
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
        });

        expect(result.args.status).toBe('A');
    });

    it('should call multiple status handle by effect name', async () => {
        const result = await statusService.mutateEffects({
            expedition: { currentNode: { data: { round: 2 } } } as Expedition,
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
        });

        expect(result.args.status).toBe('AC');
    });

    // it('should call status event by type', async () => {
    //     const result = await statusService.processStatusEffects(
    //         [
    // });
});
