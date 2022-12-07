import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Encounter } from './encounter.schema';
import { StandardResponse, SWARAction, SWARMessageType } from '../../standardResponse/standardResponse';
import { ExpeditionService } from '../expedition/expedition.service';
import { SocketId } from 'socket.io-adapter';

@Injectable()
export class EncounterService {
    constructor(
        @InjectModel(Encounter.name)
        private readonly encounterModel: Model<Encounter>,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async getByEncounterId(encounterId: number): Promise<Encounter> {
        const encounter = await this.encounterModel
            .findOne({ encounterId })
            .exec();
        return encounter;
    }

    async encounterChoice(
        clientId: SocketId,
        choiceIdx: number,
    ): Promise<string> {
        const currentNode = await this.expeditionService.getCurrentNode({
            clientId: clientId,
        });

        //place holder values
        return StandardResponse.respond({
            message_type: SWARMessageType.EncounterUpdate,
            action: SWARAction.FinishEncounter,
            data: {},
        });
    }
}
