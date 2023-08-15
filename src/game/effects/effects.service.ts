import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { find } from 'lodash';
import { CombatService } from '../combat/combat.service';
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
    EffectProducer,
    MutateDTO,
} from './effects.interface';
import { CardTargetedEnum } from '../components/card/card.enum';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Injectable()
export class EffectService {
    private readonly logger: Logger = new Logger(EffectService.name);
    private handlers: ProviderContainer<EffectMetadata, EffectHandler>[];

    constructor(
        private readonly providerService: ProviderService,
        private readonly statusService: StatusService,
        private readonly historyService: HistoryService,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        @Inject(forwardRef(() => TrinketService))
        private readonly trinketService: TrinketService,
        @Inject(forwardRef(() => CombatService))
        private readonly combatService: CombatService,
    ) {}

    async applyAll(dto: ApplyAllDTO): Promise<void> {
        const { ctx, source, effects, selectedEnemy, producer } = dto;

        for (const effect of effects) {
            const targets = this.combatService.getEntitiesByType(
                ctx,
                effect.target,
                source,
                selectedEnemy,
            );

            // if it's a single attack targeting all enemies, ensure we don't remove buffs until the attack generated effects are over
            let effectBuffer = effect.target === CardTargetedEnum.AllEnemies ? targets.length : 1;

            for (const target of targets) {
                // immediately remove some buffer, and if it's not enough, no longer will the status survive
                effectBuffer--;
                effect.args.statusIgnoreForRemove = effectBuffer > 0;

                await this.apply({ctx, source, target, effect, producer});
            }

        }
    }

    public async apply(dto: ApplyDTO) {
        const { ctx, source, target, effect, producer } = dto;
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
            action: action,
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
            producer: producer
        };

        const isCombat = this.expeditionService.isPlayerInCombat(ctx);

        if (isCombat) {
            effectDTO = await this.mutate({
                ctx,
                dto: effectDTO,
                effect: name,
            });
        }

        // attach action after mutate, rather than pipe it through
        effectDTO.action = action;

        for (let i = 1; i <= times; i++) {
            const { metadata, instance } = this.findContainerByName(name);

            if (isCombat) {
                // Check if the combat has ended
                if (this.combatService.isCurrentCombatEnded(ctx) && !metadata.effect.ghost) {
                    this.logger.log(
                        ctx.info,
                        `Combat ended, skipping effect ${effect.effect}`,
                    );
                    return;
                }

                // Check if the target is dead, if so, skip the effect
                if (this.combatService.isEntityDead(ctx, target) && !metadata.effect.ghost) {
                    this.logger.log(
                        ctx.info,
                        `Target is dead, skipping effect ${effect.effect}`,
                    );
                    return;
                }
            }

            // Send the queue id to the effects to add the target
            this.logger.log(
                {
                    ...ctx.info,
                    effect,
                },
                `Effect ${name} applied to ${target.type}`,
            );

            // console.log("----------INSTANCE:")
            // console.log(instance)
            // console.log("---------------------")
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


        const specialAttack = dto.dto.args.type ? true : false;
        const potionAttack  = dto.dto.producer && dto.dto.producer == EffectProducer.Potion;

        //- if it is especial attack we ignore the buffs of the player:    
        if(!specialAttack && !potionAttack){
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
        }
        
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

        if (typeof container === 'undefined')
            throw new Error(`Effect ${name} not found`);

        return container;
    }
}
