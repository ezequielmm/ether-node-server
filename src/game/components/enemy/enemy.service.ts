import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from 'kindagoose';
import { Enemy } from './enemy.schema';
import { EnemyId, enemyIdField, enemySelector } from './enemy.type';
import { GameContext, ExpeditionEntity } from '../interfaces';
import { EnemyAction, EnemyScript, ExpeditionEnemy, IntentOption } from './enemy.interface';
import { CardTargetedEnum } from '../card/card.enum';
import { find, reject, sample, isEmpty, each, isEqual } from 'lodash';
import { ExpeditionService } from '../expedition/expedition.service';
import {
    ENEMY_CURRENT_COOLDOWN_PATH,
    ENEMY_CURRENT_SCRIPT_PATH,
    ENEMY_DEFENSE_PATH,
    ENEMY_HP_CURRENT_PATH,
    ENEMY_STATUSES_PATH,
    ENEMY_SWARM_COCOON_IDS,
} from './constants';
import { getDecimalRandomBetween, getRandomBetween, getRandomItemByWeight } from 'src/utils';
import {
    AttachedStatus,
    Status,
    StatusCounterType,
    StatusesGlobalCollection,
    StatusType,
} from 'src/game/status/interfaces';
import { StatusService } from 'src/game/status/status.service';
import { EnemyCategoryEnum, EnemyIntentionType } from './enemy.enum';
import { damageEffect } from 'src/game/effects/damage/constants';
import {
    EVENT_ENEMY_DEAD,
    HARD_MODE_NODE_END,
    HARD_MODE_NODE_START,
} from 'src/game/constants';
import { ReturnModelType } from '@typegoose/typegoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ProjectionFields } from 'mongoose';
import { MapService } from 'src/game/map/map.service';
import { MapType } from '../expedition/map.schema';
import { Node } from 'src/game/components/expedition/node';
import { Expedition } from '../expedition/expedition.schema';

import { IExpeditionCurrentNodeDataEnemy, IntentCooldown } from '../expedition/expedition.interface';
import { swarmCocoon1Data } from './data/swarmCocoon1.enemy';
import { swarmCocoon2Data } from './data/swarmCocoon2.enemy';
import { mutantSpider1Data } from './data/mutantSpider1.enemy';
import { mutantSpider2Data } from './data/mutantSpider2.enemy';
import { randomUUID } from 'crypto';
import { EnemyBuilderService } from './enemy-builder.service';
import { chargingBeam } from 'src/game/status/chargingBeam/constants';
import { swarmMasterData } from './data/swarmMaster.enemy';
import { boobyTrapData } from './data/boobyTrap.enemy';
import { deepDwellerMonsterData } from './data/deepDwellerMonster.enemy';
import { deepDwellerLureData } from './data/deepDwellerLure.enemy';
import { mossySkeletonData } from './data/mossySkeleton.enemy';
import { mossyArcherData } from './data/mossyArcher.enemy';

@Injectable()
export class EnemyService {

    private readonly logger: Logger = new Logger(EnemyService.name);

    //------------------------------------------------------------------------------------------------------------------------------------
    //- I created this condition for security, 
    // it should not be necessary but there is a possibility 
    // that all attacks have a cooldown greater than 0, 
    // and that would imply that the while is executed endlessly
    private readonly MAX_INTENTS_ITERATIONS = 50;
    //------------------------------------------------------------------------------------------------------------------------------------

    private readonly NOT_SCOREABLE_ENEMIES = [
        deepDwellerLureData.enemyId,
        mossySkeletonData.enemyId,
        mossyArcherData.enemyId
    ];

    constructor(
        @InjectModel(Enemy)
        private readonly enemy: ReturnModelType<typeof Enemy>,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        @Inject(forwardRef(() => StatusService))
        private readonly statusService: StatusService,
        private readonly eventEmitter: EventEmitter2,

        @InjectModel(MapType)
        private readonly mapModel: ReturnModelType<typeof MapType>,

        // @InjectModel(Expedition)
        // private readonly expedition: ReturnModelType<typeof Expedition>,

    ) { }



    /**
     * Check if the entity is an enemy
     *
     * @param entity ExpeditionEntity
     * @returns If the entity is an enemy
     */
    public static isEnemy(entity: ExpeditionEntity): entity is ExpeditionEnemy {
        return entity.type === CardTargetedEnum.Enemy;
    }
    public static getEnemy(target: ExpeditionEntity) {
        return (target as ExpeditionEnemy);
    }
    /**
     * Check if the enemy is dead
     *
     * @param enemy Enemy
     * @returns If the enemy is dead
     */
    public isDead(enemy: ExpeditionEnemy): boolean {
        return enemy.value.hpCurrent <= 0;
    }

    /**
     * Check if all enemies are dead
     *
     * @param ctx Context
     * @returns If all enemies are dead
     */
    public isAllDead(ctx: GameContext): boolean {
        return this.getAll(ctx).every((enemy) => this.isDead(enemy));
    }
    public isBossDead(ctx: GameContext): boolean {
        return this.getAll(ctx).some(enemy =>
            enemy.value.category === EnemyCategoryEnum.Boss && this.isDead(enemy)
        );
    }

    public async createNewStage2Enemy(enemy:Enemy): Promise<IExpeditionCurrentNodeDataEnemy>{
        const formattedCooldowns = this.enemyIntentsToExpeditionEnemyCooldowns(enemy);
        
        const newHealth = getRandomBetween(
            enemy.healthRange[0],
            enemy.healthRange[1],
        );
        
        const newEnemyInstance = {
            id: randomUUID(),
            enemyId: enemy.enemyId,
            name: enemy.name,
            category: enemy.category,
            type: enemy.type,
            size: enemy.size,
            defense: 0,
            hpCurrent: newHealth,
            hpMax: newHealth,
            line: 0,
            statuses: {
                [StatusType.Buff]: [],
                [StatusType.Debuff]: [],
            },
            aggressiveness: enemy.aggressiveness,
            intentCooldowns: formattedCooldowns
        }

        return newEnemyInstance;
    }

    public async createNewStage2EnemyWithStatuses(enemy:Enemy, buffs:AttachedStatus[], debuffs:AttachedStatus[]): Promise<IExpeditionCurrentNodeDataEnemy>{
        const formattedCooldowns = this.enemyIntentsToExpeditionEnemyCooldowns(enemy);
        
        const newHealth = getRandomBetween(
            enemy.healthRange[0],
            enemy.healthRange[1],
        );
        
        const newEnemyInstance = {
            id: randomUUID(),
            enemyId: enemy.enemyId,
            name: enemy.name,
            category: enemy.category,
            type: enemy.type,
            size: enemy.size,
            defense: 0,
            hpCurrent: newHealth,
            hpMax: newHealth,
            line: 0,
            statuses: {
                [StatusType.Buff]: buffs,
                [StatusType.Debuff]: debuffs,
            },
            aggressiveness: enemy.aggressiveness,
            intentCooldowns: formattedCooldowns
        }

        return newEnemyInstance;
    }
    
    /**
     * Returns enemy by id or enemyId
     *
     * @param enemyId EnemyId
     * @returns Enemy
     */
    public async findById(
        enemyId: EnemyId,
        projection?: ProjectionFields<Enemy>,
    ): Promise<Enemy> {
        return typeof enemyId === 'string'
            ? this.enemy.findById(enemyId, projection).lean()
            : this.enemy.findOne({ enemyId }, projection).lean();
    }

    /**
     * Returns all enemies in the expedition
     *
     * @param ctx Context
     * @returns Enemies
     */
    public getAll(ctx: GameContext): ExpeditionEnemy[] {
        const { expedition } = ctx;

        if (!expedition.currentNode?.data?.enemies)
            throw new Error('Current node has no enemies');

        const enemiesToReturn: ExpeditionEnemy[] = [];

        for (const enemy of expedition.currentNode.data.enemies) {
            enemiesToReturn.push({
                type: CardTargetedEnum.Enemy,
                value: enemy,
            });
        }

        return enemiesToReturn;
    }

    public getLiving(ctx: GameContext): ExpeditionEnemy[] {
        return this.getAll(ctx).filter((enemy) => !this.isDead(enemy));
    }

    public getEnemyStatuses(ctx: GameContext): StatusesGlobalCollection {
        return this.statusService
            .getAllFromEnemies(ctx)
            .filter(
                (entity) =>
                    entity.target.type == CardTargetedEnum.Enemy &&
                    entity.target.value.hpCurrent > 0,
            );
    }

    public haveChangedStatuses(
        ctx: GameContext,
        priorStatuses: StatusesGlobalCollection,
    ): boolean {
        let changesFound = false;
        const currentStatuses = this.getEnemyStatuses(ctx);

        each(currentStatuses, (enemy) => {
            if (
                !isEqual(
                    enemy.statuses,
                    find(
                        priorStatuses,
                        (e) =>
                            e.target.type == CardTargetedEnum.Enemy &&
                            enemy.target.type == CardTargetedEnum.Enemy &&
                            e.target.value.enemyId ==
                            enemy.target.value.enemyId,
                    ).statuses,
                )
            ) {
                changesFound = true;
                return false; // end 'each'
            }
        });

        return changesFound;
    }

    /**
     * Returns enemy by id or enemyId from the expedition
     *
     * @param ctx Context
     * @param id Enemy id
     * @returns Enemy
     */
    public get(ctx: GameContext, id: EnemyId): ExpeditionEnemy {
        const enemies = this.getAll(ctx);

        for (const enemy of enemies) {
            if (enemy.value[enemyIdField(id)] === id) return enemy;
        }

        return null;
    }

    /**
     * Returns a random enemy from the expedition
     *
     * @param ctx Context
     * @returns Random enemy
     */
    public getRandom(ctx: GameContext): ExpeditionEnemy {
        const enemies = this.getAll(ctx);

        return sample(
            // Reject enemies that are dead
            reject(enemies, {
                value: {
                    hpCurrent: 0,
                },
            }),
        );
    }

    /**
     * Sets the current script of an enemy
     *
     * @param ctx Context
     * @param id Enemy id
     * @param script Enemy script value
     * @returns Enemy script value
     */
    public async setCurrentScript(ctx: GameContext, id: EnemyId, script: EnemyScript): Promise<EnemyScript> {
        const enemy = this.get(ctx, id);

        await this.expeditionService.updateByFilter(
            {
                _id: ctx.expedition._id,
                ...enemySelector(enemy.value.id),
            },
            {
                [ENEMY_CURRENT_SCRIPT_PATH]: script,
            },
        );

        enemy.value.currentScript = script;

        this.logger.log(ctx.info, `Set script of enemy ${id} to ${script}`);

        return script;
    }

    /**
     * Sets the defense of an enemy
     *
     * @param ctx Context
     * @param id Enemy id
     * @param defense Defense value
     * @returns Defense value
     */
    public async setDefense(
        ctx: GameContext,
        id: EnemyId,
        defense: number,
    ): Promise<number> {
        const enemy = this.get(ctx, id);

        await this.expeditionService.updateByFilter(
            {
                _id: ctx.expedition._id,
                ...enemySelector(enemy.value.id),
            },
            {
                [ENEMY_DEFENSE_PATH]: defense,
            },
        );

        enemy.value.defense = defense;

        this.logger.log(ctx.info, `Set defense of enemy ${id} to ${defense}`);

        return defense;
    }

    /**
     * Sets the health of an enemy
     *
     * @param ctx Context
     * @param id Enemy id
     * @param hp Health value
     * @returns Health value
     */
    public async setHp(ctx: GameContext, id: EnemyId, hp: number): Promise<number> {
        const enemy = this.get(ctx, id);
        const newHp = Math.min(hp, enemy.value.hpMax);

        await this.expeditionService.updateByFilter(
            {
                _id: ctx.expedition._id,
                ...enemySelector(enemy.value.id),
            },
            {
                [ENEMY_HP_CURRENT_PATH]: newHp,
            },
        );

        enemy.value.hpCurrent = newHp;

        this.logger.log(ctx.info, `Set hpCurrent of enemy ${id} to ${hp}`);
        return newHp;
    }

    /**
     * Applies damage to an enemy
     *
     * @param ctx Context
     * @param id Enemy id
     * @param damage Damage value
     * @returns New health value
     */
    public async damage(
        ctx: GameContext,
        id: EnemyId,
        damage: number,
    ): Promise<number> {
        const { value: enemy } = this.get(ctx, id);
        const { client } = ctx;

        // First we check if the enemy has defense
        if (enemy.defense > 0) {
            // if is true, then we reduce the damage to the defense
            const newDefense = enemy.defense - damage;

            // Next we check if the new defense is lower than 0
            // and use the remaining value to reduce to the health
            // and the set the defense to 0
            if (newDefense < 0) {
                enemy.hpCurrent = Math.max(0, enemy.hpCurrent + newDefense);
                enemy.defense = 0;
            } else {
                // Otherwise, we update the defense with the new value
                enemy.defense = newDefense;
            }
        } else {
            // Otherwise, we apply the damage to the enemy's health
            enemy.hpCurrent = Math.max(0, enemy.hpCurrent - damage);
        }

        this.logger.log(
            ctx.info,
            `Player ${client.id} applied damage of ${damage} to enemy ${id}`,
        );

        await this.setHp(ctx, id, enemy.hpCurrent);
        await this.setDefense(ctx, id, enemy.defense);

        if(this.NOT_SCOREABLE_ENEMIES.includes(enemy.enemyId)){
            return enemy.hpCurrent;
        }

        if (enemy.hpCurrent === 0) {
            let pathToUpdate = undefined;
            switch (enemy.category) {
                case EnemyCategoryEnum.Basic:
                    pathToUpdate = 'basicEnemiesDefeated';
                    break;
                case EnemyCategoryEnum.Minion:
                    pathToUpdate = 'minionEnemiesDefeated';
                    break;
                case EnemyCategoryEnum.Elite:
                    pathToUpdate = 'eliteEnemiesDefeated';
                    break;
                case EnemyCategoryEnum.Boss:
                    pathToUpdate = 'bossEnemiesDefeated';
                    break;
            }

            if (pathToUpdate) {
                ctx.expedition.scores[pathToUpdate]++;
            }

            //TODO: Refactor the below to just use pathToUpdate, when there's time to test it.
            await this.expeditionService.updateByFilter(
                {
                    clientId: client.id,
                },
                {
                    $inc: {
                        ...(enemy.category === EnemyCategoryEnum.Basic && {
                            'scores.basicEnemiesDefeated': 1,
                        }),
                        ...(enemy.category === EnemyCategoryEnum.Minion && {
                            'scores.minionEnemiesDefeated': 1,
                        }),
                        ...(enemy.category === EnemyCategoryEnum.Elite && {
                            'scores.eliteEnemiesDefeated': 1,
                        }),
                        ...(enemy.category === EnemyCategoryEnum.Boss && {
                            'scores.bossEnemiesDefeated': 1,
                        }),
                    },
                },
            );

            await this.eventEmitter.emitAsync(EVENT_ENEMY_DEAD, { ctx, enemy });
        }
        return enemy.hpCurrent;
    }

    public getAmountOfEnemiesByIds(ctx: GameContext, enemiesIds:number[]): number{
        const enemiesAlive = this.getLiving(ctx);
        const enemiesAliveIds = enemiesAlive.map(e => e.value.enemyId);
        let counter = 0;

        for(let enemyAliveId of enemiesAliveIds){
            if(enemiesIds.includes(enemyAliveId)){
                counter ++;
            }
        }

        return counter;
    }


    /**
 * Calculate new scripts for all enemies
 *
 * @param ctx Context
 */
    public async calculateNewIntentions(ctx: GameContext): Promise<void> {
        const enemiesAlive = this.getLiving(ctx);

        for (const enemy of enemiesAlive) {
            
            const enemy_DB = await this.findById(enemy.value.enemyId);
            const { scripts, attackLevels } = enemy_DB;
            const currentScript = enemy.value.currentScript;
            let nextScript: EnemyScript;

            if(scripts && scripts.length > 0){
                if (currentScript) {
                    nextScript = this.getNextScript(scripts, currentScript);
                } else {
                    nextScript = scripts[0];
    
                    // If the first script does not have intentions,
                    // then it is used only to calculate the next possible script
                    if (isEmpty(nextScript.intentions)) {
                        nextScript = this.getNextScript(scripts, nextScript);
                    }
                }
                
                // Increase damage for node from 14 to 20
                const expeditionId = ctx.expedition.id;
            
                // console.warn("ESTE ES EL NUEVO EXPEDITION ID : " + expeditionId);

                // Increase damage for node from 14 to 20
                const arrayOfMaps = await this.getMapByExpedition(expeditionId);
                
                // console.warn("ESTE ES EL NUEVO ARRAY DE MAPAS : " + arrayOfMaps)

                // const node = ctx.expedition.map.find(
                const node = arrayOfMaps.find(
                    (node) => node.id == ctx.expedition.currentNode.nodeId,
                );

                if (HARD_MODE_NODE_START <= node.step && node.step <= HARD_MODE_NODE_END) {
                    this.increaseScriptDamage(nextScript);
                }

                await this.expeditionService.updateByFilter(
                    {
                        clientId: ctx.client.id,
                        ...enemySelector(enemy.value.id),
                    },
                    {
                        [ENEMY_CURRENT_SCRIPT_PATH]: nextScript,
                    },
                );
            }
            else if(attackLevels){

                if(enemy_DB.enemyId === swarmMasterData.enemyId){
                    nextScript = this.getNextSwarmMasterScript(ctx, currentScript, attackLevels[0].options, enemy.value.hpCurrent);
                    this.setCurrentScript(ctx, enemy.value.id, nextScript);
                } else if(ENEMY_SWARM_COCOON_IDS.includes(enemy_DB.enemyId)){
                    nextScript = this.getNextSwarmCocoonScript(currentScript, attackLevels[0].options);
                    this.setCurrentScript(ctx, enemy.value.id, nextScript);
                }else if(enemy_DB.enemyId === boobyTrapData.enemyId && !currentScript){
                    nextScript = {id: 0, intentions: [EnemyBuilderService.boobyTrapSpecial()]};
                    this.setCurrentScript(ctx, enemy.value.id, nextScript);
                }else if(enemy_DB.enemyId === deepDwellerMonsterData.enemyId){
                    nextScript = this.getNextDeepDwellerMonsterScript(enemy, currentScript, attackLevels[0].options);
                    this.setCurrentScript(ctx, enemy.value.id, nextScript);
                }
                else{
                    const enemyAggressiveness = enemy.value.aggressiveness ? enemy.value.aggressiveness : enemy_DB.aggressiveness;
                    nextScript = this.getNextScriptWithAggressiveness(attackLevels, enemyAggressiveness, enemy.value.intentCooldowns);
                    const nextAttackCooldown = this.getFullCoolDownIntent(nextScript.id, enemy_DB);
    
                    let decreasedCooldowns = this.decreaseCooldowns(enemy.value.intentCooldowns);
                    decreasedCooldowns = this.setCooldownCurrentAttack(decreasedCooldowns, nextScript.id, nextAttackCooldown);
    
                    enemy.value.intentCooldowns = decreasedCooldowns;
    
                    await this.expeditionService.updateByFilter(
                        {
                            clientId: ctx.client.id,
                            ...enemySelector(enemy.value.id),
                        },
                        {
                            [ENEMY_CURRENT_SCRIPT_PATH]: nextScript,
                            [ENEMY_CURRENT_COOLDOWN_PATH]: decreasedCooldowns
                        },
                    );
                }

            }

            enemy.value.currentScript = nextScript;

            this.logger.log(
                ctx.info,
                `Calculated new script for enemy ${enemy.value.id}`,
            );
            this.logger.log(
                ctx.info,
                `New script: ${JSON.stringify(nextScript)}`,
            );
            
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

    

    //- Set the cooldown for the current attack. 
    private setCooldownCurrentAttack(cooldowns: IntentCooldown[], intentId: number, cooldown: number): IntentCooldown[] {
        return cooldowns.map((intentCooldown) => {
            if (intentCooldown.idIntent === intentId) {
                return { ...intentCooldown, cooldown };
            }
            return intentCooldown;
        });
    }

    //- After a turn all the cooldowns should de decreased.
    private decreaseCooldowns(cooldowns: IntentCooldown[]): IntentCooldown[] {
        return cooldowns.map((intentCooldown) => {
            if (intentCooldown.cooldown > 0) {
                return { ...intentCooldown, cooldown: intentCooldown.cooldown - 1 };
            }
            return intentCooldown;
        });
    }

    //- Returns intent cooldown from the original Enemy.
    private getFullCoolDownIntent(intentId:number, enemy:Enemy): number {
        for (const level of enemy.attackLevels) {
            for (const option of level.options) {
                if (option.id === intentId) {
                    return option.cooldown;
                }
            }
        }

        return 0;
    }
    
    //- Returns next attack available (not cooldown) based on aggressiveness
    private getNextScriptWithAggressiveness(attackLevels: EnemyAction[], aggressiveness: number, cooldowns: IntentCooldown[]): EnemyScript{

        //- Get an attack from the selected list that does not have active cooldown
        let validAttack = false;
        let possibleAttack:EnemyScript;
        let count = 1;
        let selectsFrom = 0;

        // console.log("------------------------------------------------------------")
        // console.log("Comienza una iteración de ataque:")
        // console.log("Agresividad del enemigo:" + aggressiveness)

        while(!validAttack && count <= this.MAX_INTENTS_ITERATIONS){

            //- Aggressiveness determines the chances of taking an attack from the list of strong attacks:
            const randomValue = getDecimalRandomBetween(0, 1);
            // console.log("Random number: " + randomValue)
            selectsFrom = 0;

            if(randomValue < aggressiveness && attackLevels.length > 1){
                selectsFrom = 1;
                // console.log("Selecciona de la lista de ataques fuertes.")
            }else {
                // console.log("Selecciona de la lista de ataques debiles.")
            }

            
            //- Get one possible attack from selected list:
            possibleAttack = this.getAttackFromList(attackLevels[selectsFrom].options);

            // console.log("Id de Tentativa de ataque: " + possibleAttack.id)

            //- Check if the Attack has cooldown greater than 0
            const attackCooldown = cooldowns.find(intent => intent.idIntent === possibleAttack.id);
            // console.log("Cooldown del ataque particular: " + attackCooldown.cooldown);

            if(!attackCooldown || attackCooldown.cooldown == 0){
                validAttack = true;
                // console.log("Ataque válido.")
            }else{
                count ++;
                // console.log("No es un ataque válido, repitiendo proceso..")
            }
        }

        return possibleAttack;
    }

    private getAttackFromList(options: IntentOption[]): EnemyScript{
        
        //- A random is created to determine which attack from the selected list is selected:
        const randomValue = getDecimalRandomBetween(0, 1);
        let cumulativeProbability = 0;

        for(const option of options){
            cumulativeProbability += option.probability;

            if (randomValue <= cumulativeProbability) {
                return {
                    id: option.id,
                    intentions: option.intents
                };
            }
        }
    }

    private getNextScript(scripts: EnemyScript[], currentScript: EnemyScript): EnemyScript {
        return find(scripts, {
            id: getRandomItemByWeight(
                currentScript.next,
                currentScript.next.map((s) => s.probability),
            ).scriptId,
        });
    }

    /**
     * Increase damage for script
     *
     * @param script Script
     * @param scale Scale to increase
     */
    private increaseScriptDamage(script: EnemyScript, scale = 1.5) {
        script.intentions.forEach((intention) => {
            if (intention.type == EnemyIntentionType.Attack) {
                intention.value = Math.floor(intention.value * scale);
                intention.effects.forEach((effect) => {
                    if (effect.effect == damageEffect.name) {
                        effect.args.value = Math.floor(
                            effect.args.value * scale,
                        );
                    }
                });
            }
        });
    }

    /**
     * Get multiple enemies by their id
     *
     * @param enemies number[]
     */
    async findEnemiesById(enemies: number[]): Promise<Enemy[]> {
        return await this.enemy.find({ enemyId: { $in: enemies } }).lean();
    }

    /**
     * Attach a status to an enemy
     *
     * @param ctx Context
     * @param id Enemy id
     * @param source Source of the status (Who is attacking)
     * @param status Status to attach
     * @param [args = { value: 1 }] Arguments to pass to the status
     *
     * @returns Attached status
     * @throws Error if the status is not found
     */
    async attach(
        ctx: GameContext,
        id: EnemyId,
        source: ExpeditionEntity,
        name: Status['name'],
        args: AttachedStatus['args'] = { counter: 1 },
    ): Promise<AttachedStatus> {
        const enemy = this.get(ctx, id);
        // Get metadata to determine the type of status to attach
        const metadata = this.statusService.getMetadataByName(name);

        // Check if the status is already attached
        const oldStatus = find(enemy.value.statuses[metadata.status.type], {
            name,
        });

        let finalStatusAttached: AttachedStatus;
        if (oldStatus) {
            // If the status is already attached, we update it
            if (metadata.status.counterType != StatusCounterType.None) {
                // If the status has a counter, we increment it
                oldStatus.args.counter += args.counter;
                this.logger.log(
                    ctx.info,
                    `Status ${name} counter incremented to ${oldStatus.args.counter}`,
                );
            } else {
                this.logger.log(ctx.info, `Status ${name} has no counter`);
            }

            finalStatusAttached = oldStatus;
        } else {
            // Create the status to attach
            const status: AttachedStatus = {
                name,
                args,
                sourceReference: {
                    type: source.type,
                    id: source.value['id'],
                },
                addedInRound: ctx.expedition.currentNode.data.round,
            };

            // Attach the status to the enemy
            enemy.value.statuses[metadata.status.type].push(status);

            finalStatusAttached = status;
        }

        // Save the status to the database
        await this.expeditionService.updateByFilter(
            {
                _id: ctx.expedition._id,
                ...enemySelector(enemy.value.id),
            },
            {
                [ENEMY_STATUSES_PATH]: enemy.value.statuses,
            },
        );

        this.logger.log(ctx.info, `Status ${name} attached to enemy ${id}`);

        return finalStatusAttached;
    }

    public enemyIntentsToExpeditionEnemyCooldowns(enemy:Enemy):IntentCooldown[]{
        const intentOptionsList: IntentOption[][] = enemy.attackLevels.map((enemyAction) => enemyAction.options);
        const allIntentOptions:  IntentOption[] = intentOptionsList.flat();

        const formattedIntents: IntentCooldown[] = allIntentOptions.map((intentOption) => ({
            idIntent: intentOption.id,
            cooldown: intentOption.cooldown,
        }));

        return formattedIntents;
    }

    private getNextSwarmCocoonScript(currentScript:EnemyScript, intents:IntentOption[]): EnemyScript{
        // console.log("----------------")
        // console.log(currentScript)
        // console.log("----------------")
        if(currentScript){
            if(currentScript.id == 0){
                return {id: intents[1].id, intentions: intents[1].intents};
            }
                
            return {id: intents[2].id, intentions: intents[2].intents};
        }

        return {id: intents[1].id, intentions: intents[1].intents}; 
        
    }

    private getNextSwarmMasterScript(ctx:GameContext, currentScript:EnemyScript, intents:IntentOption[], enemyHP:number): EnemyScript{

        if(!currentScript){
            //- First intent:
            return {id: intents[2].id, intentions: intents[2].intents};
        }

        //- Next attacks will be determinated by the enemy's HP:
        const amountOfCocoons = this.getAmountOfEnemiesByIds(ctx, [swarmCocoon1Data.enemyId, swarmCocoon2Data.enemyId]);
        const amountOfSpiders = this.getAmountOfEnemiesByIds(ctx, [mutantSpider1Data.enemyId, mutantSpider2Data.enemyId]);
        const enemiesOnScreen = this.getLiving(ctx).length;
        
        if(enemyHP >= 200){
            //- Large:
            return this.swarmMasterLargeScript(ctx, amountOfCocoons, amountOfSpiders, enemiesOnScreen, intents);
        }
        if(enemyHP > 99 && enemyHP < 200){
            //- Normal:
            return this.swarmMasterNormalScript(ctx, amountOfCocoons, amountOfSpiders, enemiesOnScreen, intents);
            
        }
        return this.swarmMasterSaggyScript(ctx, amountOfCocoons, amountOfSpiders, enemiesOnScreen, intents);
    }

    private swarmMasterLargeScript(ctx:GameContext, amountOfCocoons:number, amountOfSpiders:number, enemiesOnScreen:number, intents:IntentOption[]): EnemyScript{
        
        const lessThan2Cocoons = amountOfCocoons < 2;
        const lessThan2Spiders = amountOfSpiders < 2;
        
        const spider = { id: intents[1].id, intentions: intents[1].intents }
        const cocoon = { id: intents[0].id, intentions: intents[0].intents }
        const secondCocoon = { id: intents[9].id, intentions: intents[9].intents }
        const secondSpider = { id: intents[10].id, intentions: intents[10].intents }
        
        if(lessThan2Cocoons && lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- %50 chance to invoke 1 Spider or 1 Cocoon
            const amountSpider1 = this.getAmountOfEnemiesByIds(ctx, [mutantSpider1Data.enemyId]);
            const amountCocoon1 = this.getAmountOfEnemiesByIds(ctx, [swarmCocoon1Data.enemyId]);
            return getRandomItemByWeight([amountSpider1 > 0 ? secondSpider : spider, amountCocoon1 > 0 ? secondCocoon : cocoon], [50, 50]);
        }
        if(!lessThan2Cocoons && lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- Summon 1 Spider:
            const amountSpider1 = this.getAmountOfEnemiesByIds(ctx, [mutantSpider1Data.enemyId]);
            return (amountSpider1 > 0 ? secondSpider : spider)
        }
        if(lessThan2Cocoons && !lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- Summon 1 Cocoon:
            const amountCocoon1 = this.getAmountOfEnemiesByIds(ctx, [swarmCocoon1Data.enemyId]);
            return (amountCocoon1 > 0 ? secondCocoon : cocoon)
        }
            
        //- Va a elegir 50 50 entre id 5 y 6
        const defense = { id: intents[4].id, intentions: intents[4].intents }
        const attack  = { id: intents[5].id, intentions: intents[5].intents }
        return getRandomItemByWeight([defense, attack], [50, 50]);
    }


    private swarmMasterNormalScript(ctx:GameContext, amountOfCocoons:number, amountOfSpiders:number, enemiesOnScreen:number, intents:IntentOption[]): EnemyScript{

        const lessThan2Cocoons = amountOfCocoons < 2;
        const lessThan2Spiders = amountOfSpiders < 2;

        if(lessThan2Cocoons && lessThan2Spiders && !(enemiesOnScreen >= 5)){
            const cocoon  = { id: intents[0].id, intentions: intents[0].intents }
            const spider  = { id: intents[1].id, intentions: intents[1].intents }
            const cocoon2 = { id: intents[2].id, intentions: intents[2].intents }
            const spider2 = { id: intents[3].id, intentions: intents[3].intents }
            const secondCocoon = { id: intents[9].id, intentions: intents[9].intents }
            const secondSpider = { id: intents[10].id, intentions: intents[10].intents }

            if(amountOfCocoons == 0 && amountOfSpiders == 0){
                return getRandomItemByWeight([cocoon, cocoon2, spider, spider2], [25, 25, 25, 25]);
            }

            if(amountOfCocoons == 1 && amountOfSpiders == 0){
                if(this.getAmountOfEnemiesByIds(ctx, [swarmCocoon1Data.enemyId]) > 0){
                    return getRandomItemByWeight([secondCocoon, spider, spider2], [34, 33, 33]);
                }
                return getRandomItemByWeight([cocoon, spider, spider2], [34, 33, 33]);
            }

            if(amountOfCocoons == 0 && amountOfSpiders == 1){
                if(this.getAmountOfEnemiesByIds(ctx, [mutantSpider1Data.enemyId]) > 0){
                    return getRandomItemByWeight([cocoon, cocoon2, secondSpider], [34, 33, 33]);
                }
                return getRandomItemByWeight([cocoon, cocoon2, spider], [34, 33, 33]);
            }

            if(amountOfCocoons == 1 && amountOfSpiders == 1){
                const amountSpider1 = this.getAmountOfEnemiesByIds(ctx, [mutantSpider1Data.enemyId]);
                const amountCocoon1 = this.getAmountOfEnemiesByIds(ctx, [swarmCocoon1Data.enemyId]);

                return getRandomItemByWeight([amountCocoon1 > 0 ? secondCocoon : cocoon, amountSpider1 > 0 ? secondSpider : spider], [50, 50]);
            }
        }
        if(!lessThan2Cocoons && lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- Summon 1 or 2 Spider:
            const spider  = { id: intents[1].id, intentions: intents[1].intents }
            const spider2 = { id: intents[3].id, intentions: intents[3].intents }
            const secondSpider = { id: intents[10].id, intentions: intents[10].intents }

            if(enemiesOnScreen >= 4){
                if(this.getAmountOfEnemiesByIds(ctx, [mutantSpider1Data.enemyId]) > 0){
                    return secondSpider;
                }

                return spider;
            }

            return getRandomItemByWeight([spider, spider2], [50, 50]);
        }
        if(lessThan2Cocoons && !lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- Summon 1 Cocoon:
            const cocoon = { id: intents[0].id, intentions: intents[0].intents }
            const cocoon2 = { id: intents[2].id, intentions: intents[2].intents }
            const secondCocoon = { id: intents[9].id, intentions: intents[9].intents }

            if(enemiesOnScreen >= 4){
                if(this.getAmountOfEnemiesByIds(ctx, [swarmCocoon1Data.enemyId]) > 0){
                    return secondCocoon;
                }
                return cocoon;
            }

            return getRandomItemByWeight([cocoon, cocoon2], [50, 50]);
        }
        
        //- %25 chance of use Attack, Defense, 
        const defense = { id: intents[4].id, intentions: intents[4].intents }
        const attack  = { id: intents[5].id, intentions: intents[5].intents }
        const redThunder =    { id: intents[6].id, intentions: intents[6].intents }
        const greenThunder  = { id: intents[7].id, intentions: intents[7].intents }
        
        return getRandomItemByWeight([defense, attack, redThunder, greenThunder], [25, 25, 25, 25]);
    }

    private swarmMasterSaggyScript(ctx:GameContext, amountOfCocoons:number, amountOfSpiders:number, enemiesOnScreen:number, intents:IntentOption[]): EnemyScript{
        
        const lessThan2Cocoons = amountOfCocoons < 2;
        const lessThan2Spiders = amountOfSpiders < 2;

        // console.log({amountOfCocoons})
        // console.log({amountOfSpiders})
        // console.log({enemiesOnScreen})
        
        //- Saggy:
        if(lessThan2Cocoons && lessThan2Spiders && !(enemiesOnScreen >= 5)){
            const cocoon  = { id: intents[0].id, intentions: intents[0].intents }
            const spider  = { id: intents[1].id, intentions: intents[1].intents }
            const cocoon2 = { id: intents[2].id, intentions: intents[2].intents }
            const spider2 = { id: intents[3].id, intentions: intents[3].intents }
            const secondCocoon = { id: intents[9].id, intentions: intents[9].intents }
            const secondSpider = { id: intents[10].id, intentions: intents[10].intents }

            if(amountOfCocoons == 0 && amountOfSpiders == 0){
                return getRandomItemByWeight([cocoon, cocoon2, spider, spider2], [25, 25, 25, 25]);
            }

            if(amountOfCocoons == 1 && amountOfSpiders == 0){
                if(this.getAmountOfEnemiesByIds(ctx, [swarmCocoon1Data.enemyId]) > 0){
                    return getRandomItemByWeight([secondCocoon, spider, spider2], [34, 33, 33]);
                }
                return getRandomItemByWeight([cocoon, spider, spider2], [34, 33, 33]);
            }

            if(amountOfCocoons == 0 && amountOfSpiders == 1){
                if(this.getAmountOfEnemiesByIds(ctx, [mutantSpider1Data.enemyId]) > 0){
                    return getRandomItemByWeight([cocoon, cocoon2, secondSpider], [34, 33, 33]);
                }
                return getRandomItemByWeight([cocoon, cocoon2, spider], [34, 33, 33]);
            }

            if(amountOfCocoons == 1 && amountOfSpiders == 1){
                const amountSpider1 = this.getAmountOfEnemiesByIds(ctx, [mutantSpider1Data.enemyId]);
                const amountCocoon1 = this.getAmountOfEnemiesByIds(ctx, [swarmCocoon1Data.enemyId]);

                return getRandomItemByWeight([amountCocoon1 > 0 ? secondCocoon : cocoon, amountSpider1 > 0 ? secondSpider : spider], [50, 50]);
            }
        }
        if(!lessThan2Cocoons && lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- Summon 1 or 2 Spider:

            const spider  = { id: intents[1].id, intentions: intents[1].intents }
            const spider2 = { id: intents[3].id, intentions: intents[3].intents }
            const secondSpider = { id: intents[10].id, intentions: intents[10].intents }

            if(enemiesOnScreen >= 4){
                if(this.getAmountOfEnemiesByIds(ctx, [mutantSpider1Data.enemyId]) > 0){
                    return secondSpider;
                }

                return spider;
            }

            return getRandomItemByWeight([spider, spider2], [50, 50]);
        }
        if(lessThan2Cocoons && !lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- Summon 1 Cocoon:
            const cocoon  = { id: intents[0].id, intentions: intents[0].intents }
            const cocoon2 = { id: intents[2].id, intentions: intents[2].intents }
            const secondCocoon = { id: intents[9].id, intentions: intents[9].intents }

            if(enemiesOnScreen >= 4){
                if(this.getAmountOfEnemiesByIds(ctx, [swarmCocoon1Data.enemyId]) > 0){
                    return secondCocoon;
                }
                return cocoon;
            }

            return getRandomItemByWeight([cocoon, cocoon2], [50, 50]);
        }
        
        const defense      = { id: intents[4].id, intentions: intents[4].intents }
        const redThunder   = { id: intents[6].id, intentions: intents[6].intents }
        const greenThunder = { id: intents[7].id, intentions: intents[7].intents }
        //const signature    = { id: intents[8].id, intentions: intents[8].intents }
        
        return getRandomItemByWeight([defense, redThunder, greenThunder], [50, 25, 25]);
    }

    private getNextDeepDwellerMonsterScript(enemy:ExpeditionEnemy, currentScript:EnemyScript, intents:IntentOption[]): EnemyScript{
        const signatureMove = { id: intents[0].id, intentions: intents[0].intents }
        const attack        = { id: intents[1].id, intentions: intents[1].intents }
        const buff3Resolve  = { id: intents[2].id, intentions: intents[2].intents }
        const laser         = { id: intents[3].id, intentions: intents[3].intents }
        
        //- First attack is Signature Move:
        const statusBeam = enemy.value.statuses.buff.find(s => s.name === chargingBeam.name);
        const loadingBeam = (statusBeam && statusBeam.args.counter > 0);

        const noScript = !currentScript || currentScript.id == 0;
        
        if(noScript && !loadingBeam){
            return signatureMove;
        }else{
            if(loadingBeam){ 
                //- If counter is 1 next attack will be Laser:
                if(statusBeam.args.counter === 1){
                    return laser;
                }
                //- If Signature Move was performed. It will Buff or attack. 
                return getRandomItemByWeight([attack, buff3Resolve], [50,50]);
            }
            
            return signatureMove;
        }
    }
}
