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
import { Expedition } from 'src/game/components/expedition/expedition.schema';

@Injectable()
export class MapService {

    @Inject(MapService)
    private readonly mapModel: ReturnModelType<typeof MapService>
    @Inject(Expedition)
    private readonly expedition: ReturnModelType<typeof Expedition>

    constructor(
        private readonly moduleRef: ModuleRef,

    ) { }



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

    public disableAll(ctx: GameContext) {
        const expedition = this.expedition.findById(ctx.expedition._id).populate('maps').exec();

        if (!expedition) {
            throw new Error('Expedition not found');
        }

        const mapId = ctx.expedition.map._id; // Reemplaza esto con el ID del mapa que deseas obtener

        const mapDocument = this.mapModel.findById(mapId);

        if (!mapDocument) {
            throw new Error("Map not found");
        }

        const mapsArray = mapDocument.map;


        for (const node of mapsArray) {
            // Skip if node is already disabled
            if (!node.isAvailable()) continue;

            this.disableNode(ctx, node.id);
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

    public makeClientSafe(mapData: any): Node[] {
        const map = mapData.map; // Accede al campo 'map' del JSON

        const nextPortalIndex: number = map.findIndex(
            (node: any) =>
                node.type === NodeType.Portal &&
                node.status !== NodeStatus.Completed,
        );

        // Solo necesitamos los nodos hasta el siguiente portal, así que deshazte del resto
        const sanitizedMap = map.slice(
            0,
            nextPortalIndex !== -1 ? nextPortalIndex + 1 : map.length,
        );

        /// Now let's return the map after purging all state info from nodes that aren't completed or currently active
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

    public getClientSafeMap(ctx: GameContext): Node[] {
        return this.makeClientSafe(ctx.expedition.map);
    }
}
