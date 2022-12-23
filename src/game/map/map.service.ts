import { Injectable } from '@nestjs/common';
import { find, last } from 'lodash';
import { NodeStatus } from '../components/expedition/node-status';
import { Node } from '../components/expedition/node';
import { GameContext } from '../components/interfaces';
import buildActZero from './act/act-zero/index';
import buildActOne from './act/act-one/index';
import buildActTwo from './act/act-two/index';
import { ModuleRef } from '@nestjs/core';
import { NodeStrategy } from './map/strategies/node-strategy';
import { strategies } from './map/strategies/index';

@Injectable()
export class MapService {
    constructor(private readonly moduleRef: ModuleRef) {}

    public selectNode(ctx: GameContext, nodeId: number): void {
        const node = this.findNodeById(ctx, nodeId);

        // Check if node is available
        if (node.status !== NodeStatus.Available) {
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
        if (node.status !== NodeStatus.Active) {
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
        return buildActZero();
    }

    public setupActOne(ctx: GameContext): void {
        const previousNodeId = last(ctx.expedition.map)?.id || 0;
        ctx.expedition.map.push(...buildActOne(previousNodeId + 1));
    }

    public setupActTwo(ctx: GameContext): void {
        const previousNodeId = last(ctx.expedition.map)?.id || 0;
        ctx.expedition.map.push(...buildActTwo(previousNodeId + 1));
    }

    public nodeIsSelectable(ctx: GameContext, nodeId: number): boolean {
        const node = this.findNodeById(ctx, nodeId);

        // Check if node is available
        if (
            node.status != NodeStatus.Available &&
            node.status != NodeStatus.Active
        ) {
            return false;
        }

        true;
    }
}
