import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { find, findIndex, slice } from 'lodash';
import { NodeStatus } from '../components/expedition/node-status';
import { Node } from '../components/expedition/node';
import { GameContext } from '../components/interfaces';
import { ModuleRef } from '@nestjs/core';
import { NodeStrategy } from './strategies/node-strategy';
import { strategies } from './strategies/index';
import { NodeType } from '../components/expedition/node-type';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'kindagoose';
import { MapType } from 'src/game/components/expedition/map.schema';
import { Expedition } from 'src/game/components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Injectable()
export class MapService {



    constructor(
        private readonly moduleRef: ModuleRef,

        @InjectModel(MapType)
        private readonly mapModel: ReturnModelType<typeof MapType>,
        @InjectModel(Expedition)
        private readonly expedition: ReturnModelType<typeof Expedition>,

        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,


    ) { }



    public async selectNode(ctx: GameContext, nodeId: number): Promise<void> {
        try {
            const node: Node | null = await this.findNodeById(ctx, nodeId);

            // Si no se encuentra el nodo, lanza un error o maneja el caso según tu lógica de negocio
            if (!node) {
                throw new Error(`Node with ID ${nodeId} not found`);
            }

            // Comprueba si el nodo está disponible
            if (node.status !== NodeStatus.Available) {
                throw new Error('Node is not available');
            }

            // Deshabilita todos los demás nodos
            this.disableAll(ctx);

            // Establece el nodo como activo
            node.status = NodeStatus.Active;
            node.timesSelected = 1;

            // Llama a la estrategia del nodo si está definida
            const nodeStrategy = this.getNodeStrategy(node);
            if (nodeStrategy && nodeStrategy.onSelect) {
                nodeStrategy.onSelect(ctx, node);
            }
        } catch (error) {
            // Maneja el error según tu lógica de negocio (lanzar, loggear, etc.)
            console.error(`Error selecting node: ${error.message}`);
            // Puedes lanzar el error nuevamente si deseas que la excepción se propague
            // throw error;
        }
    }


    public getNodeStrategy(node: Node): NodeStrategy {
        const strategy = strategies.get(node.type);

        if (strategy) {
            return this.moduleRef.get(strategy);
        }

        return undefined;
    }

    public async disableAll(ctx: GameContext) {
        const expedition = this.expedition.findById(ctx.expedition._id).populate('maps').exec();

        if (!expedition) {
            throw new Error('Expedition not found');
        }

        // const mapId = ctx.expedition.map._id; // Reemplaza esto con el ID del mapa que deseas obtener

        const mapsArray = await this.getMapByExpedition(ctx.expedition.id);

        console.warn("Este es el otro mapsArray: " + mapsArray);

        for (const node of mapsArray) {
            // Skip if node is already disabled
            if (node.status !== NodeStatus.Available) continue;

            this.disableNode(ctx, node.id);
        }
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



    public async enableNode(ctx: GameContext, nodeId: number): Promise<void> {
        const node = await this.findNodeById(ctx, nodeId);
        node.status = NodeStatus.Available;
    }

    public async disableNode(ctx: GameContext, nodeId: number): Promise<void> {
        const node = await this.findNodeById(ctx, nodeId);
        node.status = NodeStatus.Disabled;
    }

    public async completeNode(ctx: GameContext, nodeId: number): Promise<void> {
        try {
            const node: Node | null = await this.findNodeById(ctx, nodeId);

            // Si no se encuentra el nodo, lanza un error o maneja el caso según tu lógica de negocio
            if (!node) {
                throw new Error(`Node with ID ${nodeId} not found`);
            }

            // Comprueba si el nodo está activo
            if (node.status !== NodeStatus.Active) {
                throw new Error('Node is not active');
            }

            // Establece el nodo como completado
            node.status = NodeStatus.Completed;

            // Habilita todos los nodos que están conectados a este nodo
            this.enableNextNodes(ctx, nodeId);

            // Llama a la estrategia del nodo si está definida
            const nodeStrategy = this.getNodeStrategy(node);
            if (nodeStrategy && nodeStrategy.onCompleted) {
                nodeStrategy.onCompleted(ctx, node);
            }
        } catch (error) {
            // Maneja el error según tu lógica de negocio (lanzar, loggear, etc.)
            console.error(`Error completing node: ${error.message}`);
            // Puedes lanzar el error nuevamente si deseas que la excepción se propague
            // throw error;
        }
    }

    /*
        private enableNextNodes(ctx: GameContext, nodeId: number) {
            for (const node of ctx.expedition.map) {
                if (node.enter.includes(nodeId)) {
                    this.enableNode(ctx, node.id);
                }
            }
        }
    */

    private async enableNextNodes(ctx: GameContext, nodeId: number): Promise<void> {
        try {
            // Obtener el documento de la expedición
            const expeditionDocument = await this.expedition.findById(ctx.expedition._id);

            if (expeditionDocument) {
                // Obtener el mapa relacionado con la expedición
                const mapDocument = await this.mapModel.findById(expeditionDocument.map);

                if (mapDocument) {
                    // Iterar sobre los nodos del mapa
                    for (const node of mapDocument.map) {
                        if (node.enter.includes(nodeId)) {
                            this.enableNode(ctx, node.id);
                        }
                    }
                } else {
                    console.error('Mapa no encontrado para la expedición.');
                }
            } else {
                console.error('Expedición no encontrada.');
            }
        } catch (error) {
            // Manejar errores aquí
            console.error(error);
            throw new Error('Error habilitando nodos siguientes: ' + error.message);
        }
    }

    public async findNodeById(ctx: GameContext, nodeId: number): Promise<Node> {
        
        const expeditionAllMaps: Node[] = await this.getMapByExpedition(ctx.expedition.id);
        
        return find(expeditionAllMaps, {
            id: nodeId,
        });
    }

    // public getActZero(): Node[] {
    //     return buildActZero();
    // }

    // public async getActOne(initialNodeId): Promise<Node[]> {
    //     return buildActOne(initialNodeId);
    // }

    // public async getActTwo(initialNodeId): Promise<Node[]> {
    //     return buildActTwo(initialNodeId);
    // }

    // public setupActOne(ctx: GameContext): void {
    //     const previousNodeId = last(ctx.expedition.map)?.id ?? 0;
    //     ctx.expedition.map.push(...buildActOne(previousNodeId + 1));
    // }

    // public setupActTwo(ctx: GameContext): void {
    //     const previousNodeId = last(ctx.expedition.map)?.id ?? 0;
    //     ctx.expedition.map.push(...buildActTwo(previousNodeId + 1));
    // }

    public async nodeIsSelectable(ctx: GameContext, nodeId: number): Promise<boolean> {
        const node = await this.findNodeById(ctx, nodeId);
        return node.status === NodeStatus.Available || node.status === NodeStatus.Active;
    }

    public makeClientSafe(map: Node[]): Node[] {
        const nextPortalIndex: number = findIndex(
            map,
            (node) =>
                node.type === NodeType.Portal &&
                node.status !== NodeStatus.Completed,
        );

        // We only need to sanitize (and return) up to that portal, so let's ditch the rest
        map = slice(
            map,
            0,
            nextPortalIndex !== -1 ? nextPortalIndex + 1 : map.length,
        );

        // Now let's return the map after purging all state info from nodes that aren't completed or currently active
        return map.map((node) => {
            if (
                node.status === NodeStatus.Completed ||
                node.status == NodeStatus.Active
            ) {
                return node;
            }

            delete node.private_data;
            delete node.state;

            return node;
        });
    }

    public async getClientSafeMap(ctx: GameContext): Promise<Node[]> {

        const mapsArray = await this.getMapByExpedition(ctx.expedition.id)

        return this.makeClientSafe(mapsArray);
    }
}
