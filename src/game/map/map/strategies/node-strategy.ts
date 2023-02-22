import { Node } from '../../../components/expedition/node';
import { GameContext } from '../../../components/interfaces';

export interface NodeStrategy {
    onSelect?: (ctx: GameContext, node: Node) => void;
    onCompleted?: (ctx: GameContext, node: Node) => void;
}
