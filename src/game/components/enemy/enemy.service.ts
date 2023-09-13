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
    ENEMY_SWARM_MASTER_ID,
} from './constants';
import { getDecimalRandomBetween, getRandomItemByWeight } from 'src/utils';
import {
    AttachedStatus,
    Status,
    StatusCounterType,
    StatusesGlobalCollection,
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
import { IntentCooldown } from '../expedition/expedition.interface';
import { swarmCocoon1Data } from './data/swarmCocoon1.enemy';
import { swarmCocoon2Data } from './data/swarmCocoon2.enemy';
import { mutantSpider1Data } from './data/mutantSpider1.enemy';
import { mutantSpider2Data } from './data/mutantSpider2.enemy';

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

    constructor(
        @InjectModel(Enemy)
        private readonly enemy: ReturnModelType<typeof Enemy>,
        @Inject(forwardRef(() => ExpeditionService))
        private readonly expeditionService: ExpeditionService,
        @Inject(forwardRef(() => StatusService))
        private readonly statusService: StatusService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

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
    public async setHp(
        ctx: GameContext,
        id: EnemyId,
        hp: number,
    ): Promise<number> {
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
    async calculateNewIntentions(ctx: GameContext): Promise<void> {
        const enemiesAlive = this.getLiving(ctx);

        for (const enemy of enemiesAlive) {
            
            const enemy_DB = await this.findById(enemy.value.enemyId);
            const { scripts, attackLevels } = enemy_DB;
            const currentScript = enemy.value.currentScript;
            let nextScript: EnemyScript;

            console.log("------------------------------------------------------------");
            console.log("------------------------------------------------------------")
            console.log("Ataque de enemigo: " + enemy_DB.name)

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
                const node = ctx.expedition.map.find((node) => node.id == ctx.expedition.currentNode.nodeId);

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

                if(enemy_DB.enemyId === ENEMY_SWARM_MASTER_ID){
                    nextScript = this.getNextSwarmMasterScript(ctx, currentScript, attackLevels[0].options, enemy.value.hpCurrent);
                    this.setCurrentScript(ctx, enemy.value.id, nextScript);
                } else if(ENEMY_SWARM_COCOON_IDS.includes(enemy_DB.enemyId)){
                    nextScript = this.getNextSwarmCocoonScript(currentScript, attackLevels[0].options);
                    this.setCurrentScript(ctx, enemy.value.id, nextScript);
                }
                else{
                    const enemyAggressiveness = enemy.value.aggressiveness ? enemy.value.aggressiveness : enemy_DB.aggressiveness;
                    nextScript = this.getNextScriptWithAggressiveness(attackLevels, enemyAggressiveness, enemy.value.intentCooldowns);
                    const nextAttackCooldown = this.getFullCoolDownIntent(nextScript.id, enemy_DB);
                    
                    console.log("Next attack cooldown:")
                    console.log(nextAttackCooldown)
    
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

        console.log("------------------------------------------------------------")
        console.log("Comienza una iteración de ataque:")
        console.log("Agresividad del enemigo:" + aggressiveness)

        while(!validAttack && count <= this.MAX_INTENTS_ITERATIONS){

            //- Aggressiveness determines the chances of taking an attack from the list of strong attacks:
            const randomValue = getDecimalRandomBetween(0, 1);
            console.log("Random number: " + randomValue)
            selectsFrom = 0;

            if(randomValue < aggressiveness){
                selectsFrom = 1;
                console.log("Selecciona de la lista de ataques fuertes.")
            }else {
                console.log("Selecciona de la lista de ataques debiles.")
            }

            
            //- Get one possible attack from selected list:
            possibleAttack = this.getAttackFromList(attackLevels[selectsFrom].options);

            console.log("Id de Tentativa de ataque: " + possibleAttack.id)

            //- Check if the Attack has cooldown greater than 0
            const attackCooldown = cooldowns.find(intent => intent.idIntent === possibleAttack.id);
            console.log("Cooldown del ataque particular: " + attackCooldown.cooldown);

            if(!attackCooldown || attackCooldown.cooldown == 0){
                validAttack = true;
                console.log("Ataque válido.")
            }else{
                count ++;
                console.log("No es un ataque válido, repitiendo proceso..")
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
                oldStatus.args.counter+= args.counter;
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
        console.log("----------------")
        console.log(currentScript)
        console.log("----------------")
        if(currentScript){
            if(currentScript.id == -1){
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
            console.log("Enemy Large")
            return this.swarmMasterLargeScript(amountOfCocoons, amountOfSpiders, enemiesOnScreen, intents);
        }
        if(enemyHP > 99 && enemyHP < 200){
            //- Normal:
            console.log("Enemy Normal")
            return this.swarmMasterNormalScript(amountOfCocoons, amountOfSpiders, enemiesOnScreen, intents);
            
        }
        console.log("Enemy Saggy")
        return this.swarmMasterSaggyScript(amountOfCocoons, amountOfSpiders, enemiesOnScreen, intents);
    }

    private swarmMasterLargeScript(amountOfCocoons:number, amountOfSpiders:number, enemiesOnScreen:number, intents:IntentOption[]): EnemyScript{
        
        const lessThan2Cocoons = amountOfCocoons < 2;
        const lessThan2Spiders = amountOfSpiders < 2;
        
        if(lessThan2Cocoons && lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- %50 chance to invoke 1 Spider or 1 Cocoon
            const spider = { id: intents[1].id, intentions: intents[1].intents }
            const cocoon = { id: intents[0].id, intentions: intents[0].intents }
            return getRandomItemByWeight([spider, cocoon], [50, 50]);
        }
        if(!lessThan2Cocoons && lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- Summon 1 Spider:
            return { id: intents[1].id, intentions: intents[1].intents }
        }
        if(lessThan2Cocoons && !lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- Summon 1 Cocoon:
            return { id: intents[0].id, intentions: intents[0].intents }
        }
            
        //- Va a elegir 50 50 entre id 5 y 6
        const defense = { id: intents[4].id, intentions: intents[4].intents }
        const attack  = { id: intents[5].id, intentions: intents[5].intents }
        return getRandomItemByWeight([defense, attack], [50, 50]);
    }


    private swarmMasterNormalScript(amountOfCocoons:number, amountOfSpiders:number, enemiesOnScreen:number, intents:IntentOption[]): EnemyScript{

        const lessThan2Cocoons = amountOfCocoons < 2;
        const lessThan2Spiders = amountOfSpiders < 2;

        if(lessThan2Cocoons && lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- %25 chance to invoke 1 Spider, 1 Cocoon, 2 spiders, 2 cocoons
            const spider  = { id: intents[1].id, intentions: intents[1].intents }
            const spider2 = { id: intents[2].id, intentions: intents[2].intents }
            const cocoon  = { id: intents[0].id, intentions: intents[0].intents }
            const cocoon2 = { id: intents[3].id, intentions: intents[3].intents }

            return getRandomItemByWeight([spider, cocoon, spider2, cocoon2], [25, 25, 25, 25]);
        }
        if(!lessThan2Cocoons && lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- Summon 1 or 2 Spider:
            const spider  = { id: intents[1].id, intentions: intents[1].intents }
            const spider2 = { id: intents[3].id, intentions: intents[3].intents }
            return getRandomItemByWeight([spider, spider2], [50, 50]);
        }
        if(lessThan2Cocoons && !lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- Summon 1 Cocoon:
            const cocoon = { id: intents[0].id, intentions: intents[0].intents }
            const cocoon2 = { id: intents[2].id, intentions: intents[2].intents }
            return getRandomItemByWeight([cocoon, cocoon2], [50, 50]);
        }
        
        //- %25 chance of use Attack, Defense, 
        const defense = { id: intents[4].id, intentions: intents[4].intents }
        const attack  = { id: intents[5].id, intentions: intents[5].intents }
        const redThunder =    { id: intents[6].id, intentions: intents[6].intents }
        const greenThunder  = { id: intents[7].id, intentions: intents[7].intents }
        
        return getRandomItemByWeight([defense, attack, redThunder, greenThunder], [25, 25, 25, 25]);
    }

    private swarmMasterSaggyScript(amountOfCocoons:number, amountOfSpiders:number, enemiesOnScreen:number, intents:IntentOption[]): EnemyScript{
        
        const lessThan2Cocoons = amountOfCocoons < 2;
        const lessThan2Spiders = amountOfSpiders < 2;

        console.log({amountOfCocoons})
        console.log({amountOfSpiders})
        console.log({enemiesOnScreen})
        
        //- Saggy:
        if(lessThan2Cocoons && lessThan2Spiders && !(enemiesOnScreen >= 5)){
            console.log("First option")

            const spider  = { id: intents[1].id, intentions: intents[1].intents }
            const spider2 = { id: intents[2].id, intentions: intents[2].intents }
            const cocoon  = { id: intents[0].id, intentions: intents[0].intents }
            const cocoon2 = { id: intents[3].id, intentions: intents[3].intents }

            if(enemiesOnScreen >= 4){
                if(amountOfCocoons >= 2){
                    return spider;
                }
                return cocoon;
            }else{
                if(amountOfCocoons >= 1){
                    return spider2;
                }
                return cocoon2;
            }

        }
        if(!lessThan2Cocoons && lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- Summon 1 or 2 Spider:
            console.log("Second option")

            const spider  = { id: intents[1].id, intentions: intents[1].intents }
            const spider2 = { id: intents[3].id, intentions: intents[3].intents }

            if(enemiesOnScreen >= 4){
                return spider;
            }

            return spider2;
        }
        if(lessThan2Cocoons && !lessThan2Spiders && !(enemiesOnScreen >= 5)){
            //- Summon 1 Cocoon:
            console.log("Third option")
            const cocoon = { id: intents[0].id, intentions: intents[0].intents }
            const cocoon2 = { id: intents[2].id, intentions: intents[2].intents }

            if(enemiesOnScreen >= 4){
                return cocoon;
            }

            return cocoon2;
        }
        
        console.log("Last option")
        //- %25 chance of use Attack, Defense, 
        const defense = { id: intents[4].id, intentions: intents[4].intents }
        const redThunder =    { id: intents[6].id, intentions: intents[6].intents }
        const greenThunder  = { id: intents[7].id, intentions: intents[7].intents }
        //const signature  = { id: intents[8].id, intentions: intents[8].intents }
        
        return getRandomItemByWeight([defense, redThunder, greenThunder], [50, 25, 25]);
    }
}
