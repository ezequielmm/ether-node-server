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
import { MapType } from '../components/expedition/map.schema';
import { InjectModel } from 'kindagoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Node } from '../components/expedition/node';

@Injectable()
export class FullSyncAction {
    private readonly logger: Logger = new Logger(FullSyncAction.name);

    constructor(
        private readonly expeditionService: ExpeditionService,
        private readonly mapService: MapService,
        @InjectModel(MapType)
        private readonly mapModel: ReturnModelType<typeof MapType>
    ) {}

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

        console.warn("This is the map array: " + mapsArray + "Este es el expedition id :" + expedition.id + " Este es el map pelado: " + map);

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

    public async getMapByExpedition(expeditionId: string): Promise<Node[]> {
        try {
            // Utiliza `findOne` para encontrar la expedición por su _id
            const expedition = await this.expeditionService.findOne({
                _id: expeditionId,
            });
    
            // Si no se encuentra la expedición, retorna un array vacío
            if (!expedition) {
                return [];
            }
    
            // Obtiene el ObjectID del campo map en la expedición
            const mapId = expedition.map;
    
            // Utiliza el ObjectID para buscar el documento en la colección "maps" que coincide con el valor del campo map en la expedición
            const map = await this.mapModel.findById(mapId);
    
            // Si no se encuentra el mapa, retorna un array vacío
            if (!map) {
                return [];
            }
    
            // Retorna el array de nodos almacenados en el campo map del mapa encontrado
            return map.map;
        } catch (error) {
            // Manejar errores de consulta aquí
            throw new Error('Error retrieving maps: ' + error.message);
        }
    }
}
