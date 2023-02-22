import { Injectable } from '@nestjs/common';
import { CreateCardAction } from 'src/game/action/createCard.action';
import { PlayerService } from 'src/game/components/player/player.service';
import { StatusEventDTO, StatusEventHandler } from '../interfaces';
import { StatusDecorator } from '../status.decorator';
import { armoredUp } from './contants';

@StatusDecorator({
    status: armoredUp,
})
@Injectable()
export class ArmoredUpStatus implements StatusEventHandler {
    constructor(private readonly createCardAction: CreateCardAction) {}

    async handle(dto: StatusEventDTO): Promise<void> {
        const {
            target,
            ctx: { client },
            status: {
                args: { cardsToAdd },
            },
        } = dto;

        if (PlayerService.isPlayer(target)) {
            await this.createCardAction.handle({
                client,
                cardsToAdd,
                destination: 'hand',
                sendSWARResponse: true,
            });
        }
    }
}
