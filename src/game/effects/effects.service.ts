import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { find } from 'lodash';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { TrinketService } from '../components/trinket/trinket.service';
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
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        private readonly historyService: HistoryService,
        @Inject(forwardRef(() => TrinketService))
        private readonly trinketService: TrinketService,
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
            args: { value, ...args } = {},
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

        for (let i = 1; i <= times; i++) {
            const { metadata, instance } = this.findContainerByName(name);

            // Check if the combat has ended
            if (this.expeditionService.isCurrentCombatEnded(ctx)) {
                this.logger.debug(
                    `Combat ended, skipping effect ${effect.effect}`,
                );
                return;
            }

            // Check if the target is dead, if so, skip the effect
            if (
                this.expeditionService.isEntityDead(ctx, target) &&
                !metadata.effect.ghost
            ) {
                this.logger.debug(
                    `Target is dead, skipping effect ${effect.effect}`,
                );
                return;
            }

            // Send the queue id to the effects to add the target
            this.logger.debug(`Effect ${name} applied to ${target.type}`);

            await instance.handle(effectDTO);
        }
    }

    private async mutate(dto: MutateDTO): Promise<EffectDTO> {
        const {
            ctx,
            effect,
            dto: { source, target },
        } = dto;
        let { dto: effectDTO } = dto;

        const outgoingStatuses = this.statusService.findStatusesByDirection(
            source,
            StatusDirection.Outgoing,
        );

        const incomingStatuses = this.statusService.findStatusesByDirection(
            target,
            StatusDirection.Incoming,
        );

        // Trinkets are applied before statuses
        effectDTO = await this.trinketService.pipeline(dto);

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

        const outgoingStatuses = this.statusService.findStatusesByDirection(
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

    private findContainerByName(
        name: string,
    ): ProviderContainer<EffectMetadata, EffectHandler> {
        this.handlers =
            this.handlers ||
            this.providerService.findByMetadataKey(EFFECT_METADATA_KEY);

        const container = find(this.handlers, {
            metadata: { effect: { name } },
        });

        if (container === undefined)
            throw new Error(`Effect ${name} not found`);

        return container;
    }
}
