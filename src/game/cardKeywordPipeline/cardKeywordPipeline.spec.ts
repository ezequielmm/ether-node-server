import { CardKeywordEnum } from '../components/card/card.enum';
import { CardKeywordPipeline } from './cardKeywordPipeline';

describe('Card Keyword Pipeline', () => {
    it('should return everything false if not keyword is provided', () => {
        const result = CardKeywordPipeline.process([]);

        expect(result).toHaveProperty('unplayable', false);
        expect(result).toHaveProperty('exhaust', false);
        expect(result).toHaveProperty('retain', false);
        expect(result).toHaveProperty('endTurn', false);
    });

    it('should exhaust the card', () => {
        const result = CardKeywordPipeline.process([CardKeywordEnum.Exhaust]);

        expect(result).toHaveProperty('exhaust', true);
    });

    it('should not play the card', () => {
        const result = CardKeywordPipeline.process([
            CardKeywordEnum.Unplayable,
        ]);

        expect(result).toHaveProperty('unplayable', true);
    });

    it('should retain the card', () => {
        const result = CardKeywordPipeline.process([CardKeywordEnum.Retain]);

        expect(result).toHaveProperty('retain', true);
    });

    it('should end the turn right away', () => {
        const result = CardKeywordPipeline.process([CardKeywordEnum.EndTurn]);

        expect(result).toHaveProperty('endTurn', true);
    });
});
