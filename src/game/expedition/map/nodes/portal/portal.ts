import Node from '../node';

class Portal extends Node {
    constructor(id: number, act: number, step: number, type: string, private_data: any) {
        super(id, act, step, type, private_data);
    }

    complete(): void {
        this.expeditionMap.disableAllNodes();
        this.updateStatus('completed');
        this.expeditionMap.extendMap();
    }
}

export default Portal;
