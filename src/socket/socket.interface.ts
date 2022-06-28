import { CardId } from 'src/game/components/card/card.type';
import { TargetId } from 'src/game/effects/effects.types';

export interface CardPlayedInterface {
    cardId: CardId;
    target: TargetId;
}
