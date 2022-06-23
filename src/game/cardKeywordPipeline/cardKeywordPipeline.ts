import { CardKeywordEnum } from '../components/card/enums';

interface PipelineReturn {
    unplayable: boolean;
    exhaust: boolean;
    retain: boolean;
}

export class CardKeywordPipeline {
    static process(keywords: CardKeywordEnum[]): PipelineReturn {
        const response: PipelineReturn = {
            unplayable: false,
            exhaust: false,
            retain: false,
        };

        if (keywords.includes(CardKeywordEnum.Unplayable))
            response.unplayable = true;

        if (keywords.includes(CardKeywordEnum.Exhaust)) {
            response.exhaust = true;
        }

        if (keywords.includes(CardKeywordEnum.Retain)) {
            response.retain = true;
        }

        return response;
    }
}
