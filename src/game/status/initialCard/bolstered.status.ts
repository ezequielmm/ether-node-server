import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { isEqual, reject } from 'lodash';
import { EnemyService } from 'src/game/components/enemy/enemy.service';
import { Context } from 'src/game/components/interfaces';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusService } from 'src/game/status/status.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { initialCard } from './constants';

@StatusDecorator({
    status: initialCard,
})
@Injectable()
export class initialCardStatus implements StatusEventHandler {
    private readonly logger: Logger = new Logger(initialCardStatus.name);
    constructor(
        private readonly playerService: PlayerService,
        private readonly enemyService: EnemyService,
        private readonly statusService: StatusService,
    ) {}

    async enemyHandler(dto: StatusEventDTO): Promise<void> {
        //TODO upgrade all cards
        //https://robotseamonster.atlassian.net/wiki/spaces/KOTE/pages/40108156/Card+GM

        console.log('upgrade all cards');
    }
}
