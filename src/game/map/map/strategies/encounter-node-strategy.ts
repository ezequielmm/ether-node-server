import { Injectable } from '@nestjs/common';
import { random } from 'lodash';
import { Node } from 'src/game/components/expedition/node';
import { GameContext } from 'src/game/components/interfaces';
import { NodeStrategy } from './node-strategy';

export const MIN_ENCOUNTER_ID = 0;
export const MAX_ENCOUNTER_ID = 24;
export const DEFAULT_SCENE_ID = 0;

@Injectable()
export class EncounterNodeStrategy implements NodeStrategy {
    onSelect(ctx: GameContext, node: Node) {
        node.state = {
            encounte_id: this.calcEncounterId(),
            scene_id:
                node.private_data && node.private_data.scene_id
                    ? node.private_data.scene_id
                    : DEFAULT_SCENE_ID,
        };
    }

    private calcEncounterId(): number {
        return random(MIN_ENCOUNTER_ID, MAX_ENCOUNTER_ID);
    }
}
