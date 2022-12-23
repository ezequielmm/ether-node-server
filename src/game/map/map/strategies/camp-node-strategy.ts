import { Injectable } from '@nestjs/common';
import { random } from 'lodash';
import { Node } from 'src/game/components/expedition/node';
import { GameContext } from 'src/game/components/interfaces';
import { NodeStrategy } from './node-strategy';

export const MIN_HOUSE_ID = 0;
export const MAX_HOUSE_ID = 3;

@Injectable()
export class CampNodeStrategy implements NodeStrategy {
    onSelect(ctx: GameContext, node: Node) {
        node.state.house_id = this.calculateHouseId();
    }

    private calculateHouseId(): number {
        return random(MIN_HOUSE_ID, MAX_HOUSE_ID);
    }
}
