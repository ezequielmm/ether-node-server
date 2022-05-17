import Node from '../node';

class RoyalHouse extends Node {
    constructor(id: number, act: number, step: number, type: string, private_data: any) {
        super(id, act, step, type, private_data);
    }
}

export default RoyalHouse;
