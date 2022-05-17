import Node from '../node';

abstract class Combat extends Node {
    constructor(id: number, act: number, step: number, type: string, private_data: any) {
        super(id, act, step, type, private_data);
    }

    public stateInitialize(config: any): any {
        const enemy = config.enemies[Math.floor(Math.random() * config.enemies.length)];
        this.state.enemy = enemy;
        return this.state;
    }
}

export default Combat;
