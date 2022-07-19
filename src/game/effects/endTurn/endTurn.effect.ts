import { Injectable, Logger } from '@nestjs/common';
import { EndPlayerTurnProcess } from 'src/game/process/endPlayerTurn.process';
import { EffectDecorator } from '../effects.decorator';
import { EffectDTO, EffectHandler } from '../effects.interface';
import { endTurnEffect } from './constants';

@EffectDecorator({
    effect: endTurnEffect,
})
@Injectable()
export class EndTurnEffect implements EffectHandler {
    private readonly logger: Logger = new Logger(EndTurnEffect.name);

    constructor(private readonly endPlayerTurnProcess: EndPlayerTurnProcess) {}

    async handle(payload: EffectDTO): Promise<void> {
        const { client } = payload;

        this.logger.log(
            `Card triggered message "EndTurn" to client ${client.id}`,
        );

        await this.endPlayerTurnProcess.handle({ client });
    }
}
