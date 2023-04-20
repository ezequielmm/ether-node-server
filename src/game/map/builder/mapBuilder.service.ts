import { Injectable } from '@nestjs/common';
import { Node } from '../../components/expedition/node';
import { NodeType } from '../../components/expedition/node-type';
import { CombatService } from '../../combat/combat.service';
import { EncounterService } from '../../components/encounter/encounter.service';
import { TreasureService } from '../../treasure/treasure.service';
import { MerchantService } from '../../merchant/merchant.service';
import { IActConfiguration, IActNodeOption, IActStepOption } from './mapBuilder.interface';
import { NodeStatus } from '../../components/expedition/node-status';
import { NodeConnectionManager } from './node-connection-manager';
import { filter, random } from 'lodash';
import { getRandomItemByWeight } from 'src/utils';
import { ActOneConfig } from './actOne.config';

@Injectable()
export class MapBuilderService {
    constructor(
        private readonly combatService: CombatService,
        private readonly encounterService: EncounterService,
        private readonly treasureService: TreasureService,
        private readonly merchantService: MerchantService,
    ) {}

    public async getActOneConfig() {
        return ActOneConfig;
    };

    public async createMap({
        actConfig,
        initialStepId = 0,
        initialNodeId = 0,
        initialConnectFrom,
        makeAvailable = true,
    }: {
        actConfig: IActConfiguration,
        initialStepId?: number,
        initialNodeId?: number,
        initialConnectFrom?: number,
        makeAvailable?: boolean,
    }): Promise<Node[]> {

        const map: Node[] = [];
        let currentStepConfig = actConfig.stepRangeConfig['DEFAULT'];
        let stepRangeCounts: { [id: string]: number[] } = {};
        let mapValues = {
            act: actConfig.actNumber,
        };

        for (let stepsCreated = 0; stepsCreated < actConfig.stepCount; stepsCreated++) {
            const currentStepId = initialStepId + stepsCreated;
            
            // if this step has a config defined, update the one we're using
            if (Object.keys(actConfig.stepRangeConfig).includes('STEP-'+stepsCreated)) 
            {
                currentStepConfig = actConfig.stepRangeConfig['STEP-'+stepsCreated];
                stepRangeCounts = {}; // new range, reset all range counts
            }
            
            // if this is the final step, and final is defined, use it
            if (typeof actConfig.stepRangeConfig['FINAL'] !== undefined && stepsCreated == actConfig.stepCount - 1 ) 
            {
                currentStepConfig = actConfig.stepRangeConfig['FINAL'];
                stepRangeCounts = {}; // new range, reset all range counts
            }

            // Clear any values saved for reuse in previous step
            let stepValues = {};

            let nodesToAddForStep = currentStepConfig.fixedNodes?.length ?? 0;

            // How many non-fixed nodes should we add to the step (never more than grid supports)?
            if (currentStepConfig.minNodes && currentStepConfig.maxNodes) {
                nodesToAddForStep += random(
                    Math.min(currentStepConfig.minNodes, actConfig.maxNodesPerStep), 
                    Math.min(currentStepConfig.maxNodes,actConfig.maxNodesPerStep)
                );                
            }
            
            // now cycle through each node SLOT, and place nodes among them
            for (let nodeOfStep = 0; nodeOfStep < actConfig.maxNodesPerStep; nodeOfStep++) {
                if (nodesToAddForStep <= 0) break;

                //node IDs are not sequential, but are instead based on placement within the overall map grid
                const currentNodeId = initialNodeId + ((stepsCreated * actConfig.maxNodesPerStep) + nodeOfStep);

                // odds of a node in slot change based on nodes to place and how many are left
                const oddsOfNode = nodesToAddForStep / (actConfig.maxNodesPerStep - nodeOfStep);
                const compare = Math.random();

                // if no node this time, skip rest of loop
                if (oddsOfNode < compare) continue;
                
                // if we get here, we're adding a node to the slot!
                nodesToAddForStep--;

                let nodeOption = undefined;
                let nodeConfig = undefined;
                let populatedData = undefined;

                if (typeof currentStepConfig.fixedNodes !== 'undefined' && nodeOfStep < currentStepConfig.fixedNodes.length) {
                    // Use fixed nodes first
                    nodeOption = currentStepConfig.fixedNodes[nodeOfStep];
                    populatedData = nodeOption.nodeConfig;   
                } else {
                    // Use a random node

                    // 1: Find the nodeOption
                    // 1a: Filter out any nodeOptions that have already been used the maximum number of times this range (i.e. Encounters)
                    const nodeOptionsRemaining = filter(
                        currentStepConfig.nodeOptions,
                        function(option) {
                            if (!option.maxStepsInRange) return true;
                            if (!stepRangeCounts[option.key]) return true;
                            if (stepRangeCounts[option.key].length < option.maxStepsInRange) return true;
                            if (stepRangeCounts[option.key].includes(currentStepId) && stepRangeCounts[option.key].length == option.maxStepsInRange) return true;
                            return false;
                        }
                    );

                    // 1b: get from currentStepConfig.nodeOptions based on "probability"
                    const nodeType: IActStepOption = getRandomItemByWeight(
                        nodeOptionsRemaining,
                        nodeOptionsRemaining.map((option) => option.probability ?? 0)
                    );

                    // 1c: Log the key discovered, for use in 1a
                    if (!stepRangeCounts[nodeType.key]) 
                    stepRangeCounts[nodeType.key] = [];
                
                    if (!stepRangeCounts[nodeType.key].includes(currentStepId)) 
                    stepRangeCounts[nodeType.key].push(currentStepId);


                    // 2a: Find the specific values within the nodeOption
                    nodeOption = getRandomItemByWeight(
                        actConfig.nodeOptions[nodeType.key],
                        actConfig.nodeOptions[nodeType.key].map((option) => option.probability ?? 0)
                    );

                    // 2b: merge step and node level config
                    nodeOption.nodeConfig = {
                        ...nodeOption.nodeConfig, // node level
                        ...nodeType.nodeConfig, // step level values override node level values
                    };

                    // 3a: Determine node population method
                    populatedData = await this.populate(nodeOption, stepValues, mapValues);

                    // figure out how to populate the node
                    // save stepvalues to key, for passing into future nodes this step
                }

                // 4: Add the node to the map
                map.push(
                    new Node({
                        id: currentNodeId,
                        act: actConfig.actNumber,
                        step: currentStepId,
                        
                        type: nodeOption.type,
                        subType: nodeOption.subType,
                        title: nodeOption.title,
                        private_data: populatedData, 
                        
                        status: NodeStatus.Disabled,
                        enter: (currentStepId == initialStepId && initialConnectFrom) ? [initialConnectFrom] : [],
                        exits: [],
                    })
                );    
            }
        }

        new NodeConnectionManager(1, 3).configureConnections(map);

        // Enable entrance nodes
        if(makeAvailable) 
            map
                .filter((node) => node.step == initialStepId)
                .forEach((node) => {
                    node.status = NodeStatus.Available;
                });

        return map;
    }

    public async populate(nodeOption: IActNodeOption, stepValues?, mapValues?) {
        let populatedData = undefined;
        switch (nodeOption.type) {

            case NodeType.Merchant:
                populatedData =
                    await this.merchantService.generateMerchant();
                break;
            
            case NodeType.Encounter:
                if (stepValues?.encounterId) {
            
                    populatedData = {
                        encounterId: stepValues.encounterId,
                        stage: 0,
                    };
            
                } else {
            
                    populatedData = await this.encounterService.getRandomEncounter(mapValues?.encountersUsed ?? []);
                    
                    if (!mapValues.encountersUsed) mapValues.encountersUsed = [];
                    if (mapValues.encountersUsed.includes(populatedData.encounterId)) mapValues.encountersUsed = [];
                    mapValues.encountersUsed.push(populatedData.encounterId);
            
                    stepValues.encounterId = populatedData.encounterId;

                }
                break;
            
            case NodeType.Treasure:
                populatedData =
                    await this.treasureService.generateBaseTreasure(nodeOption);
                break;
            
            case NodeType.Combat:
                populatedData =
                    await this.combatService.generateBaseState(
                        nodeOption,
                        mapValues.act,
                    );
                break;
            default:
                populatedData = {};
        }
        return populatedData;
    }
}
