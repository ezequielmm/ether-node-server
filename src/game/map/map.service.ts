import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { find, findIndex, slice } from 'lodash';
import { NodeStatus } from '../components/expedition/node-status';
import { Node } from '../components/expedition/node';
import { GameContext } from '../components/interfaces';
import { ModuleRef } from '@nestjs/core';
import { NodeStrategy } from './strategies/node-strategy';
import { strategies } from './strategies/index';
import { NodeType } from '../components/expedition/node-type';
import { MapType } from '../components/expedition/map.schema';
import { InjectModel } from 'kindagoose';
import { Expedition } from '../components/expedition/expedition.schema';
import { ReturnModelType } from '@typegoose/typegoose';
import { ExpeditionService } from '../components/expedition/expedition.service';
import { createVerify } from 'crypto';

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
        const node = await this.findNodeById(ctx, nodeId);

        // Check if node is available
        if (!node.isAvailable()) {
            throw new Error('Node is not available');
        }

        // Set node as active
        node.status = NodeStatus.Active;
        await this.markNode(ctx.expedition.id, nodeId, NodeStatus.Active)

        node.timesSelected = 1;
        await this.timesSelected(ctx.expedition.id, nodeId, 1);

        // Disable all other nodes
        // await this.disableAll(ctx);
        await this.disableAll(ctx, nodeId);

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
/*
    public async disableAll(ctx: GameContext) {

        const mapsArray = await this.getMapByExpedition(ctx.expedition.id);


        for (const node of mapsArray) {
            // Skip if node is already disabled
            if (node.isAvailable() && !node.isActive) 
            {
                this.disableNode(ctx, node.id);
            }
        }
    }
*/

public async disableAll(ctx: GameContext, nodeIdToExclude: number) {
    try {
        const mapsArray = await this.getMapByExpedition(ctx.expedition.id);

        for (const node of mapsArray) {
            // Skip if node is already disabled or is the node to exclude
            if (node.id !== nodeIdToExclude && node.status !== NodeStatus.Completed) {
                this.disableNode(ctx, node.id);
            }
        }
    } catch (error) {
        // Manejar errores aquí
        throw new Error('Error disabling nodes: ' + error.message);
    }
}

    public async enableNode(ctx: GameContext, nodeId: number): Promise<void> {
        const node = await this.findNodeById(ctx, nodeId);
        node.status = NodeStatus.Available;
        await this.markNode(ctx.expedition.id, nodeId, NodeStatus.Available)

    }

    public async disableNode(ctx: GameContext, nodeId: number): Promise<void> {
        const node = await this.findNodeById(ctx, nodeId);
        node.status = NodeStatus.Disabled;
        await this.markNode(ctx.expedition.id, nodeId, NodeStatus.Disabled)

    }

    public async completeNode(ctx: GameContext, nodeId: number): Promise<void> {
        const node = await this.findNodeById(ctx, nodeId);

        // Check if node is active
        if (node.isActive()) {
            //throw new Error('Node is not active');
            node.status = NodeStatus.Completed;
            await this.markNode(ctx.expedition.id, nodeId, NodeStatus.Completed)


            // Enable all nodes that are connected to this node
            this.enableNextNodes(ctx, nodeId);

            // Call node strategy
            this.getNodeStrategy(node)?.onCompleted?.(ctx, node);
        }else{
            // Enable all nodes that are connected to this node
            this.enableNextNodes(ctx, nodeId);

            // Call node strategy
            this.getNodeStrategy(node)?.onCompleted?.(ctx, node);
        }

    }

    private async enableNextNodes(ctx: GameContext, nodeId: number) {

        const mapsArray = await this.getMapByExpedition(ctx.expedition.id);

        for (const node of mapsArray) {
            if (node.enter.includes(nodeId)) {
                this.enableNode(ctx, node.id);
            }
        }
    }

    public async findNodeById(ctx: GameContext, nodeId: number): Promise<Node> {

        const mapsArray = await this.getMapByExpedition(ctx.expedition.id);


        return find(mapsArray, {
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

        const mapsArray = await this.getMapByExpedition(ctx.expedition.id);

        return this.makeClientSafe(mapsArray);
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

    public async markNode(expeditionId: string, nodeId: number, nodeStatus: NodeStatus): Promise<void> {
        try {
            // Utiliza `findOne` para encontrar la expedición por su _id
            const expedition = await this.expeditionService.findOne({
                _id: expeditionId,
            });

            // Si no se encuentra la expedición, lanza un error
            if (!expedition) {
                throw new Error('Expedition not found');
            }

            // Obtiene el ObjectID del campo map en la expedición
            const mapId = expedition.map;

            // Utiliza el ObjectID para buscar el documento en la colección "maps" que coincide con el valor del campo map en la expedición
            const map = await this.mapModel.findOne({
                '_id': mapId
            });

            // Si no se encuentra el mapa, lanza un error
            if (!map) {
                throw new Error('Map not found');
            }

            // Encuentra el nodo en el array de nodos del mapa por su _id y actualiza su estado a 'Active'
            const nodeToUpdate = map.map.find(node => node.id === nodeId);

            // Si no se encuentra el nodo, lanza un error
            if (!nodeToUpdate) {
                throw new Error('Node not found');
            }

            // Actualiza el estado del nodo a 'Active'
            nodeToUpdate.status = nodeStatus;

            // Guarda el mapa actualizado en la base de datos
            await map.save();
        } catch (error) {
            // Manejar errores aquí
            throw new Error('Error marking node as active: ' + error.message);
        }
    }

    public async timesSelected(expeditionId: string, nodeId: number, timesSelected: number): Promise<void> {
        try {
            // Utiliza `findOne` para encontrar la expedición por su _id
            const expedition = await this.expeditionService.findOne({
                _id: expeditionId,
            });

            // Si no se encuentra la expedición, lanza un error
            if (!expedition) {
                throw new Error('Expedition not found');
            }

            // Obtiene el ObjectID del campo map en la expedición
            const mapId = expedition.map;

            // Utiliza el ObjectID para buscar el documento en la colección "maps" que coincide con el valor del campo map en la expedición
            const map = await this.mapModel.findOne({
                '_id': mapId
            });

            // Si no se encuentra el mapa, lanza un error
            if (!map) {
                throw new Error('Map not found');
            }

            // Encuentra el nodo en el array de nodos del mapa por su _id y actualiza su estado a 'Active'
            const nodeToUpdate = map.map.find(node => node.id === nodeId);

            // Si no se encuentra el nodo, lanza un error
            if (!nodeToUpdate) {
                throw new Error('Node not found');
            }

            // Actualiza el estado del nodo a 'Active'
            nodeToUpdate.timesSelected = timesSelected;

            // Guarda el mapa actualizado en la base de datos
            await map.save();
        } catch (error) {
            // Manejar errores aquí
            throw new Error('Error marking node as active: ' + error.message);
        }
    }

}
