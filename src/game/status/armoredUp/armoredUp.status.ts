import { Injectable } from '@nestjs/common';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { armoredUp } from './contants';

@StatusDecorator({
    status: armoredUp,
})
@Injectable()
export class ArmoredUpStatus implements StatusEventHandler {
    constructor(private readonly playerService: PlayerService) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        const { target } = dto;

        if (PlayerService.isPlayer(target)) {
        }
    }
}
