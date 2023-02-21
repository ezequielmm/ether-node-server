import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CardId } from 'src/game/components/card/card.type';
import { TargetId } from 'src/game/effects/effects.types';
import { CardPlayedAction } from 'src/game/action/cardPlayed.action';
import { EndPlayerTurnProcess } from 'src/game/process/endPlayerTurn.process';
import { ExpeditionService } from 'src/game/components/expedition/expedition.service';
import { CombatTurnEnum } from 'src/game/components/expedition/expedition.enum';
import { EndEnemyTurnProcess } from 'src/game/process/endEnemyTurn.process';
import { corsSocketSettings } from './socket.enum';
import { NodeType } from 'src/game/components/expedition/node-type';

interface ICardPlayed {
    cardId: CardId;
    targetId?: TargetId;
}

@WebSocketGateway(corsSocketSettings)
export class CombatGateway {
    constructor(
        private readonly cardPlayedAction: CardPlayedAction,
        private readonly endPlayerTurnProcess: EndPlayerTurnProcess,
        private readonly endEnemyTurnProcess: EndEnemyTurnProcess,
        private readonly expeditionService: ExpeditionService,
    ) {}

    @SubscribeMessage('EndTurn')
    async handleEndTurn(client: Socket): Promise<void> {
        const ctx = await this.expeditionService.getGameContext(client);

        // If the combat is ended, we skip the turn
        if (this.expeditionService.isCurrentCombatEnded(ctx)) return;

        const { expedition } = ctx;

        if (
            expedition.currentNode === null ||
            expedition.currentNode.nodeType !== NodeType.Combat
        )
            return;

        const {
            currentNode: {
                data: { playing },
            },
        } = expedition;

        switch (playing) {
            case CombatTurnEnum.Player:
                await this.endPlayerTurnProcess.handle({ ctx });
                break;
            case CombatTurnEnum.Enemy:
                await this.endEnemyTurnProcess.handle({ ctx });
                break;
        }
    }

    @SubscribeMessage('CardPlayed')
    async handleCardPlayed(client: Socket, payload: string): Promise<void> {
        const ctx = await this.expeditionService.getGameContext(client);
        const { cardId, targetId }: ICardPlayed = JSON.parse(payload);

        await this.cardPlayedAction.handle({
            ctx,
            cardId,
            selectedEnemyId: targetId,
        });
    }
}
