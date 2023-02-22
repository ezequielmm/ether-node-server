import { Injectable } from '@nestjs/common';
import { GameContext } from '../components/interfaces';
import { MapService } from '../map/map.service';

interface CurrentStepResponse {
    act: number;
    step: number;
}

@Injectable()
export class GetCurrentStepAction {
    constructor(private readonly mapService: MapService) {}

    async handle(ctx: GameContext): Promise<CurrentStepResponse> {
        const { act, step } = this.mapService.findNodeById(
            ctx,
            ctx.expedition.currentNode.nodeId,
        );

        return { act, step };
    }
}
