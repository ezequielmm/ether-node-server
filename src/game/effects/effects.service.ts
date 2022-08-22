import { Injectable, Logger } from '@nestjs/common';
import { find } from 'lodash';
import { CardTargetedEnum } from '../components/card/card.enum';
import {
    CombatQueueOriginTypeEnum,
    CombatQueueTargetEffectTypeEnum,
} from '../components/combatQueue/combatQueue.enum';
import { CombatQueueDocument } from '../components/combatQueue/combatQueue.schema';
import { CombatQueueService } from '../components/combatQueue/combatQueue.service';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { HistoryService } from '../history/history.service';
import { ProviderContainer } from '../provider/interfaces';
import { ProviderService } from '../provider/provider.service';
import { StatusDirection } from '../status/interfaces';
import { StatusService } from '../status/status.service';
import { EFFECT_METADATA_KEY } from './effects.decorator';
import {
    ApplyAllDTO,
    ApplyDTO,
    EffectDTO,
    EffectHandler,
    EffectMetadata,
    MutateDTO,
} from './effects.interface';

@Injectable()
export class EffectService {
    private readonly logger: Logger = new Logger(EffectService.name);
    private handlers: ProviderContainer<EffectMetadata, EffectHandler>[];

    constructor(
        private readonly providerService: ProviderService,
        private readonly statusService: StatusService,
        private readonly combatQueueService: CombatQueueService,
        private readonly expeditionService: ExpeditionService,
        private readonly historyService: HistoryService,
    ) {}

    async applyAll(dto: ApplyAllDTO): Promise<void> {
        const { ctx, source, effects, selectedEnemy } = dto;

        for (const effect of effects) {
            const targets = this.expeditionService.getEntitiesByType(
                ctx,
                effect.target,
                source,
                selectedEnemy,
            );

            for (const target of targets) {
                await this.apply({
                    ctx,
                    source,
                    target,
                    effect,
                });
            }
        }
    }

    public async apply(dto: ApplyDTO) {
        const { ctx, source, target, effect } = dto;

        const { client } = ctx;

        if (ctx.expedition.currentNode.completed) {
            this.logger.debug(`Combat ended, skipping effect ${effect.effect}`);
            return;
        }

        // Register the effect in the history
        this.historyService.register({
            clientId: client.id,
            registry: {
                type: 'effect',
                effect: effect,
                source: this.statusService.getReferenceFromEntity(source),
                target: this.statusService.getReferenceFromEntity(target),
            },
        });

        const {
            effect: name,
            times = 1,
            args: { value, ...args },
        } = effect;

        let effectDTO: EffectDTO = {
            ctx,
            source,
            target,
            args: {
                initialValue: value,
                currentValue: value,
                ...args,
            },
        };

        effectDTO = await this.mutate({
            ctx,
            dto: effectDTO,
            effect: name,
        });

        for (let i = 0; i < times; i++) {
            let combatQueue: CombatQueueDocument = null;

            // Initialize the combat queue if the effect is damage,
            // heal or defense only

            if (
                Object.values(CombatQueueTargetEffectTypeEnum).includes(
                    name as CombatQueueTargetEffectTypeEnum,
                )
            ) {
                combatQueue = await this.combatQueueService.create({
                    clientId: client.id,
                    originType:
                        source.type === CardTargetedEnum.Player
                            ? CombatQueueOriginTypeEnum.Player
                            : CombatQueueOriginTypeEnum.Enemy,
                    originId:
                        source.type === CardTargetedEnum.Player
                            ? source.value.globalState.playerId
                            : source.value.id,
                });

                this.logger.debug(`Created Combat Queue`);
            }

            // Send the queue id to the effects to add the target
            effectDTO = {
                ...effectDTO,
                ...(combatQueue && {
                    combatQueueId: combatQueue._id.toString(),
                }),
            };

            this.logger.debug(`Effect ${name} applied to ${target.type}`);

            const handler = this.findHandlerByName(name);

            await handler.handle(effectDTO);

            // If we have a combat queue initiated, we run the queue
            if (combatQueue) {
                // Send the combat queue to the client
                this.logger.debug(`Sent combat queue to client ${client.id}`);
                await this.combatQueueService.sendQueueToClient(client);

                // Clear the queue
                this.logger.debug(
                    `Cleared combat queue to client ${client.id}`,
                );
                await this.combatQueueService.deleteCombatQueueByClientId(
                    client.id,
                );
            }
        }
    }

    private async mutate(dto: MutateDTO): Promise<EffectDTO> {
        const {
            ctx,
            effect,
            dto: { source, target },
        } = dto;
        let { dto: effectDTO } = dto;

        const outgoingStatuses = this.statusService.findEffectStatuses(
            source,
            StatusDirection.Outgoing,
        );
        const incomingStatuses = this.statusService.findEffectStatuses(
            target,
            StatusDirection.Incoming,
        );

        // Apply statuses to the outgoing effects 🔫  →
        effectDTO = await this.statusService.mutate({
            ctx,
            collection: outgoingStatuses,
            collectionOwner: source,
            effectDTO: effectDTO,
            effect,
            preview: false,
        });

        // Apply statuses to the incoming effects → 🛡
        effectDTO = await this.statusService.mutate({
            ctx,
            collection: incomingStatuses,
            collectionOwner: target,
            effectDTO: effectDTO,
            effect,
            preview: false,
        });

        return effectDTO;
    }

    public async preview(dto: MutateDTO): Promise<EffectDTO> {
        const {
            ctx,
            effect,
            dto: { source },
        } = dto;
        let { dto: effectDTO } = dto;

        const outgoingStatuses = this.statusService.findEffectStatuses(
            source,
            StatusDirection.Outgoing,
        );

        // Apply statuses to the outgoing effects 🔫  →
        effectDTO = await this.statusService.mutate({
            ctx,
            collection: outgoingStatuses,
            collectionOwner: source,
            effectDTO: effectDTO,
            effect,
            preview: true,
        });

        return effectDTO;
    }

    private findHandlerByName(name: string): EffectHandler {
        this.handlers =
            this.handlers ||
            this.providerService.findByMetadataKey(EFFECT_METADATA_KEY);

        const container = find(this.handlers, ['metadata.effect.name', name]);

        if (container === undefined)
            throw new Error(`Effect handler ${name} not found`);

        return container.instance;
    }
}
