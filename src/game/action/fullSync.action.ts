import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CustomException, ErrorBehavior } from 'src/socket/custom.exception';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { MapService } from '../map/map.service';
import {
    StandardResponse,
    SWARMessageType,
    SWARAction,
} from '../standardResponse/standardResponse';
import { ExpeditionStatusEnum } from '../components/expedition/expedition.enum';
import { id } from 'ethers6';
import { ReturnModelType } from '@typegoose/typegoose';
import { MapType } from '../components/expedition/expedition.schema';
import { InjectModel } from 'kindagoose';

@Injectable()
export class FullSyncAction {
    private readonly logger: Logger = new Logger(FullSyncAction.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly mapService: MapService,
        @InjectModel(MapType)
        private readonly mapModel: ReturnModelType<typeof MapType>
    ) { }



    async handle(client: Socket, sendShowMap = true): Promise<void> {
        const expedition = await this.expeditionService.findOneTimeDesc({
            userAddress: client.request.headers.useraddress
        });

        if (!expedition)
            throw new CustomException(
                `Expedition not found by client id ${client.id}. Another connection may have been initialized invalidating the current id.`,
                ErrorBehavior.ReturnToMainMenu,
            );

        const {
            map,
            playerState,
            mapSeedId,
            userAddress,
            id: expeditionId,
        } = expedition || {};

        this.logger.log(`Sent message ExpeditionMap to client ${client.id}`);

        const mapsArray = await this.getMapByExpedition(expedition.id)

        console.warn("This is the map array: " + mapsArray + "Este es el expedition id :" + expedition.id);

        if (sendShowMap) {
            client.emit(
                'ExpeditionMap',
                StandardResponse.respond({
                    message_type: SWARMessageType.MapUpdate,
                    seed: mapSeedId,
                    action: SWARAction.ShowMap,
                    data: this.mapService.makeClientSafe(mapsArray),
                }),
            );
        }

        this.logger.log(`Sent message PlayerState to client ${client.id}`);

        client.emit(
            'PlayerState',
            StandardResponse.respond({
                message_type: SWARMessageType.PlayerStateUpdate,
                action: SWARAction.UpdatePlayerState,
                data: {
                    expeditionId: expeditionId,
                    expeditionCreatedAt: expedition.createdAt,
                    playerState: {
                        id: playerState.userAddress,
                        userAddress,
                        playerName: playerState.playerName,
                        characterClass: playerState.characterClass,
                        hpMax: playerState.hpMax,
                        hpCurrent: playerState.hpCurrent,
                        gold: playerState.gold,
                        cards: playerState.cards,
                        potions: playerState.potions,
                        trinkets: playerState.trinkets,
                    },
                },
            }),
        );
    }

    public async getMapByExpedition(expeditionId: string): Promise<any | null> {
        try {
            // Utiliza `findOne` para encontrar la expedición por su _id
            const expedition = await this.expeditionService.findOne({
                _id: expeditionId,
            });

            // Si no se encuentra la expedición, retorna null
            if (!expedition) {
                return null;
            }

            // Utiliza `populate()` para rellenar el campo `map` con el objeto correspondiente de la colección "maps"
            await expedition.populate('map');

            // El campo `map` ahora contendrá el objeto de la colección "maps"
            const map = expedition.map;

            // Retorna el objeto del mapa encontrado o `null` si no se encuentra
            return map;
        } catch (error) {
            // Manejar errores de consulta aquí
            throw new Error('Error retrieving map: ' + error.message);
        }
    }
}
