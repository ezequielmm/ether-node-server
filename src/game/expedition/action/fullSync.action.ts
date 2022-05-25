import { Socket } from 'socket.io';
import { ExpeditionService } from '../expedition.service';
import { ExpeditionStatusEnum } from '../enums';
import { Injectable } from '@nestjs/common';
import { GameManagerService } from 'src/game/gameManger/gameManager.service';
import { Activity } from 'src/game/elements/prototypes/activity';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';

@Injectable()
export class FullSyncAction {
    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly gameManagerService: GameManagerService,
    ) {}

    async handle(client: Socket): Promise<string> {
        const action = await this.gameManagerService.startAction(
            client.id,
            'fullSync',
        );

        const expedition = await this.expeditionService.findOne({
            client_id: client.id,
            status: ExpeditionStatusEnum.InProgress,
        });

        if (!expedition) {
            throw new CustomException(
                `Expedition not found by client id ${client.id}. Another connection may have been initialized invalidating the current id.`,
                ErrorBehavior.ReturnToMainMenu,
            );
        }

        const { map, player_state } = expedition;

        action.log(
            new Activity('map', undefined, 'sync', undefined, [
                {
                    mod: 'set',
                    key: 'map',
                    val: map,
                },
            ]),
            {
                blockName: 'expeditionMap',
            },
        );

        action.log(
            new Activity('player_state', undefined, 'sync', undefined, [
                {
                    mod: 'set',
                    key: 'player_state',
                    val: player_state,
                },
            ]),
            {
                blockName: 'playerState',
            },
        );

        client.emit('ExpeditionMap', JSON.stringify({ data: map }));

        client.emit('PlayerState', JSON.stringify({ data: { player_state } }));

        return JSON.stringify(await action.end());
    }
}
