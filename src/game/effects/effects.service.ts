import { Injectable, Logger } from '@nestjs/common';
import { find } from 'lodash';
import { AttackQueueService } from '../components/attackQueue/attackQueue.service';
import { CardTargetedEnum } from '../components/card/card.enum';
import { EnemyService } from '../components/enemy/enemy.service';
import { ExpeditionEntity } from '../components/interfaces';
import { PlayerService } from '../components/player/player.service';
import { ProviderContainer } from '../provider/interfaces';
import { ProviderService } from '../provider/provider.service';
import { StatusDirection } from '../status/interfaces';
import { StatusService } from '../status/status.service';
import { damageEffect } from './damage/constants';
import { EFFECT_METADATA_KEY } from './effects.decorator';
import {
    ApplyAllDTO,
    ApplyDTO,
    EffectDTO,
    EffectHandler,
    EffectMetadata,
    FindTargetsDTO,
    MutateDTO,
} from './effects.interface';

@Injectable()
export class EffectService {
    private readonly logger: Logger = new Logger(EffectService.name);
    private handlers: ProviderContainer<EffectMetadata, EffectHandler>[];

    constructor(
        private readonly providerService: ProviderService,
        private readonly statusService: StatusService,
        private readonly enemyService: EnemyService,
        private readonly playerService: PlayerService,
        private readonly attackQueueService: AttackQueueService,
    ) {}

    async applyAll(dto: ApplyAllDTO): Promise<void> {
        const { ctx, source, effects, selectedEnemy } = dto;

        for (const effect of effects) {
            const targets = this.findAffectedTargets({
                ctx,
                effect,
                source,
                selectedEnemy,
            });

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

        if (ctx.expedition.currentNode.completed) {
            this.logger.debug(`Combat ended, skipping effect ${effect.effect}`);
            return;
        }

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

        // Here we check if the effect that we are calling
        // is the damage effect
        if (name === damageEffect.name) {
            // If it is, we get who is attacking and create the queue
            // Also we deestructure the context to get the player/enemy uuid
            // and expedition id
            const {
                ctx: {
                    expedition: { _id },
                },
                source: { type: originType },
            } = effectDTO;

            const originId =
                source.type === CardTargetedEnum.Enemy
                    ? source.value.id
                    : source.value.globalState.playerId;

            await this.attackQueueService.create({
                expeditionId: _id.toString(),
                originType,
                originId,
            });

            this.logger.debug(
                `Created attack queue for expedition: ${_id.toString()}`,
            );
        }

        for (let i = 0; i < times; i++) {
            this.logger.debug(`Effect ${name} applied to ${target.type}`);
            const handler = this.findHandlerByName(name);
            await handler.handle(effectDTO);
        }

        // Here we check again if is a damage effect
        if (name === damageEffect.name) {
            // Now we see if we have an attack queue, first
            // we get the expedition id to query the data
            const {
                ctx: {
                    client,
                    expedition: { _id },
                },
            } = effectDTO;

            this.logger.debug(
                `Sent attack queue for expedition: ${_id.toString()}`,
            );

            await this.attackQueueService.sendQueueToClient(
                { expeditionId: _id.toString() },
                client,
            );
        }
    }

    private findAffectedTargets(dto: FindTargetsDTO): ExpeditionEntity[] {
        const { ctx, effect, source, selectedEnemy } = dto;
        const targets: ExpeditionEntity[] = [];

        switch (effect.target) {
            case CardTargetedEnum.Player:
                targets.push(this.playerService.get(ctx));
                break;
            case CardTargetedEnum.Self:
                targets.push(source);
                break;
            case CardTargetedEnum.AllEnemies:
                targets.push(...this.enemyService.getAll(ctx));
                break;
            case CardTargetedEnum.RandomEnemy:
                targets.push({
                    type: CardTargetedEnum.Enemy,
                    value: this.enemyService.getRandom(ctx).value,
                });
                break;
            case CardTargetedEnum.Enemy:
                targets.push(this.enemyService.get(ctx, selectedEnemy));
                break;
        }

        if (targets === undefined)
            throw new Error(`Target not found for effect ${effect.effect}`);

        return targets;
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
