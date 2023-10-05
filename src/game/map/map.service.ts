import { Inject, Injectable } from '@nestjs/common';
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
import { Expedition, MapType } from 'src/game/components/expedition/expedition.schema';
import { ExpeditionService } from '../components/expedition/expedition.service';

@Injectable()
export class MapService {



    constructor(
        private readonly moduleRef: ModuleRef,

        @InjectModel(MapType)
        private readonly mapModel: ReturnModelType<typeof MapType>,
        @InjectModel(Expedition)
        private readonly expedition: ReturnModelType<typeof Expedition>,


    ) { }

    private readonly expeditionService: ExpeditionService


    public selectNode(ctx: GameContext, nodeId: number): void {
        const node = this.findNodeById(ctx, nodeId);

        // Check if node is available
        if (!node.isAvailable()) {
            throw new Error('Node is not available');
        }

        // Disable all other nodes
        this.disableAll(ctx);

        // Set node as active
        node.status = NodeStatus.Active;

        node.timesSelected = 1;

        // Call node strategy
        this.getNodeStrategy(node)?.onSelect?.(ctx, node);
    }

    public getNodeStrategy(node: Node): NodeStrategy | undefined {
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
            if (!node.isAvailable()) continue;

            this.disableNode(ctx, node.id);
        }
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

    public enableNode(ctx: GameContext, nodeId: number): void {
        const node = this.findNodeById(ctx, nodeId);
        node.status = NodeStatus.Available;
    }

    public disableNode(ctx: GameContext, nodeId: number): void {
        const node = this.findNodeById(ctx, nodeId);
        node.status = NodeStatus.Disabled;
    }

    public completeNode(ctx: GameContext, nodeId: number): void {
        const node = this.findNodeById(ctx, nodeId);

        // Check if node is active
        if (!node.isActive()) {
            throw new Error('Node is not active');
        }

        node.status = NodeStatus.Completed;

        // Enable all nodes that are connected to this node
        this.enableNextNodes(ctx, nodeId);

        // Call node strategy
        this.getNodeStrategy(node)?.onCompleted?.(ctx, node);
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

    private enableNextNodes(ctx: GameContext, nodeId: number) {
        try {
            // Obtener el documento de la expedición
            const expeditionDocument = this.expedition.findById(ctx.expedition._id);

            if (expeditionDocument) {
                // Obtener el mapa relacionado con la expedición
                const mapDocument = this.mapModel.findById(expeditionDocument.map);

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
        }
    }

    public findNodeById(ctx: GameContext, nodeId: number): Node {
        try {
            const expeditionId = ctx.expedition._id; // Suponiendo que expedition tenga un _id válido
            const expedition = this.expedition.findById(expeditionId);

            if (!expedition) {
                throw new Error('Expedition not found'); // O maneja el error de alguna otra manera
            }

            const node = expedition.map.find((n) => n.id === nodeId);

            if (!node) {
                throw new Error(`Node with ID ${nodeId} not found`); // O maneja el error de alguna otra manera
            }

            return node;
        } catch (error) {
            throw new Error(`Error finding node: ${error.message}`);
        }
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

    public nodeIsSelectable(ctx: GameContext, nodeId: number): boolean {
        const node = this.findNodeById(ctx, nodeId);
        return node.isSelectable();
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
        try {
            // Obtén el mapa desde la base de datos utilizando el modelo MapTypeModel
            const mapType = await this.mapModel.findById(ctx.expedition.map);
            if (!mapType) {
                throw new Error('Map not found');
            }

            // El campo 'map' en 'mapType' contendrá los nodos sin procesar (raw nodes) desde tu modelo
            const rawMap: Node[] = mapType.map;

            // Transforma el formato bruto a un formato seguro para el cliente utilizando tu lógica específica
            const clientSafeMap: Node[] = this.makeClientSafe(rawMap);

            return clientSafeMap;
        } catch (error) {
            throw new Error('Error getting client-safe map: ' + error.message);
        }
    }
}
