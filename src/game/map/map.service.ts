import { Injectable } from '@nestjs/common';
import { find, findIndex, slice, last } from 'lodash';
import { NodeStatus } from '../components/expedition/node-status';
import { Node } from '../components/expedition/node';
import { GameContext } from '../components/interfaces';
import buildActZero from './act/act-zero/index';
import buildActOne from './act/act-one/index';
import buildActTwo from './act/act-two/index';
import { ModuleRef } from '@nestjs/core';
import { NodeStrategy } from './map/strategies/node-strategy';
import { strategies } from './map/strategies/index';
import { NodeType } from '../components/expedition/node-type';

@Injectable()
export class MapService {
    constructor(private readonly moduleRef: ModuleRef) {}

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
        for (const node of ctx.expedition.map) {
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

    private enableNextNodes(ctx: GameContext, nodeId: number) {
        for (const node of ctx.expedition.map) {
            if (node.enter.includes(nodeId)) {
                this.enableNode(ctx, node.id);
            }
        }
    }

    public findNodeById(ctx: GameContext, nodeId: number): Node {
        return find(ctx.expedition.map, {
            id: nodeId,
        });
    }

    public getActZero(): Node[] {
        return []; //buildActZero();
    }

    public getActOne(initialNodeId): Node[] {
        return buildActOne(initialNodeId);
    }

    public getActTwo(initialNodeId): Node[] {
        return buildActTwo(initialNodeId);
    }

    public setupActOne(ctx: GameContext): void {
        const previousNodeId = last(ctx.expedition.map)?.id || 0;
        ctx.expedition.map.push(...this.getActOne(previousNodeId+1));
    }

    public setupActTwo(ctx: GameContext): void {
        const previousNodeId = last(ctx.expedition.map)?.id || 0;
        ctx.expedition.map.push(...this.getActTwo(previousNodeId+1));
    }

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

    public getClientSafeMap(ctx: GameContext): Node[] {
        return this.makeClientSafe(ctx.expedition.map);
    }
}
