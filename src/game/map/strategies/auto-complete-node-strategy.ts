import { Node } from '../../components/expedition/node';
import { GameContext } from '../../components/interfaces';
import { NodeStrategy } from './node-strategy';
import { MapService } from '../map.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AutoCompleteNodeStrategy implements NodeStrategy {
    constructor(
        @Inject(forwardRef(() => MapService))
        protected readonly mapService: MapService,
    ) {}

    public onSelect(ctx: GameContext, node: Node): void {

        console.warn("EL NODO HA SIDO ELEGIDO POR ONSELECT: " + node + " CON STATUS: " + node.status);

        this.mapService.completeNode(ctx, node.id);
    }
}
