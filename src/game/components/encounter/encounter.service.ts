import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Encounter } from './encounter.schema';
import { StandardResponse, SWARAction, SWARMessageType } from '../../standardResponse/standardResponse';
import { ExpeditionService } from '../expedition/expedition.service';
import { SocketId } from 'socket.io-adapter';
import { Socket } from 'socket.io';
import { EncounterInterface } from './encounter.interfaces';

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
        client: Socket,
        choiceIdx: number,
    ): Promise<string> {

        const encounterData = await this.getEncounterData(client);
        //place holder values
        return StandardResponse.respond({
            message_type: SWARMessageType.EncounterUpdate,
            action: SWARAction.FinishEncounter,
            data: {},
        });
    }

    async getEncounterData(client: Socket): Promise<EncounterInterface> {
        const ctx = await this.expeditionService.getGameContext(client);
        const expedition = ctx.expedition;
        const encounterData: EncounterInterface =
            expedition.currentNode.encounterData;
        return encounterData;
    }
}
