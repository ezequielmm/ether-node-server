import { NodeTypePool } from './node-type-pool';

describe('Node type pool', () => {
    let nodeTypePool: NodeTypePool;

    beforeEach(() => {
        nodeTypePool = undefined;
    });

    describe('Correct pool length', () => {
        it('should have a pool length of 23', () => {
            nodeTypePool = new NodeTypePool(23);
            expect(nodeTypePool['pool'].length).toBe(23);
            expect(nodeTypePool['pool'].length).toBe(nodeTypePool['length']);
            console.log(nodeTypePool['pool']);
        });
    });
});
