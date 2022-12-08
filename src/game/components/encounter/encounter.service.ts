import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Encounter } from './encounter.schema';
import {
    StandardResponse,
    SWARAction,
    SWARMessageType,
} from '../../standardResponse/standardResponse';
import { ExpeditionService } from '../expedition/expedition.service';
import { SocketId } from 'socket.io-adapter';
import { Socket } from 'socket.io';
import { EncounterInterface } from './encounter.interfaces';
import { EncounterDTO } from '../../action/getEncounterDataAction';
import { DataWSRequestTypesEnum } from '../../../socket/socket.enum';

@Injectable()
export class EncounterService {
    constructor(
        @InjectModel(Encounter.name)
        private readonly encounterModel: Model<Encounter>,
        private readonly expeditionService: ExpeditionService,
    ) {}

    async encounterChoice(client: Socket, choiceIdx: number): Promise<string> {
        const encounterData = await this.getEncounterData(client);
        const encounter = await this.getByEncounterId(
            encounterData.encounterId,
        );
        const stage = encounter.stages[encounterData.stage];
        const buttonPressed = stage.buttons[choiceIdx];
        await this.updateEncounterData(
            encounterData.encounterId,
            buttonPressed.nextStage,
            client,
        );

        const data = await this.getEncounterDTO(client);

        return StandardResponse.respond({
            message_type: SWARMessageType.GenericData,
            action: DataWSRequestTypesEnum.EncounterData,
            data,
        });
        
        
        //place holder values
        return StandardResponse.respond({
            message_type: SWARMessageType.EncounterUpdate,
            action: SWARAction.FinishEncounter,
            data: {},
        });
    }

    async getByEncounterId(encounterId: number): Promise<Encounter> {
        const encounter = await this.encounterModel
            .findOne({ encounterId })
            .exec();
        return encounter;
    }

    async getEncounterDTO(client: Socket): Promise<EncounterDTO> {
        const encounterData = await this.getEncounterData(client);
        const encounter = await this.getByEncounterId(
            encounterData.encounterId,
        );
        const stage = encounter.stages[encounterData.stage];
        const buttonText: string[] = [];
        for (let i = 0; i < stage.buttons.length; i++) {
            buttonText.push(stage.buttons[i].text);
        }
        const displayText = stage.displayText;
        const answer: EncounterDTO = { displayText, buttonText };
        return answer;
    }

    async updateEncounterData(
        encounterId: number,
        stage: number,
        client: Socket,
    ): Promise<void> {
        const encounterData = {
            encounterId,
            stage,
        };

        const ctx = await this.expeditionService.getGameContext(client);
        const expedition = ctx.expedition;
        await this.expeditionService.updateById(expedition._id.toString(), {
            $set: {
                'currentNode.encounterData': encounterData,
            },
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
