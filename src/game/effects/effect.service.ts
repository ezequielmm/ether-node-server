import { Injectable } from '@nestjs/common';
import { Card } from '../components/card/card.schema';
import { DefenseEffect } from './defense.effect';
import { DrawCardEffect } from './drawCard.effect';
import { EffectsEnum } from './enums';

type IEntity = Card;

type EntityStatusesType = IEntity['properties']['effects'];

@Injectable()
export class EffectService {
    constructor(
        private readonly defenseEffect: DefenseEffect,
        private readonly drawCardEffect: DrawCardEffect,
    ) {}

    process(payload: { effects: EntityStatusesType; client_id: string }): void {
        const { effects, client_id } = payload;

        if (EffectsEnum.Defense in effects) {
            const {
                defense: { base },
            } = effects;
            this.defenseEffect.handle({
                client_id,
                value: base,
            });
        }

        if (EffectsEnum.DrawCard in effects) {
            const {
                drawCard: { base },
            } = effects;
            this.drawCardEffect.handle({
                client_id,
                cards_to_take: base,
            });
        }
    }
}
