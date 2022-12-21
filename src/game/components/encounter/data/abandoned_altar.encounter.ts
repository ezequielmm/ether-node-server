import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const AbandonedAltar: Encounter = {
    encounterId: EncounterIdEnum.Nagpra,
    encounterName: 'Abandoned Altar',
    imageId: 'runicbeehive',
    stages: [
        {
            //0
            displayText:
                'You come across an ancient altar to an unknown spirit, covered with moss and vines. You sense that offering a sacrifice may compel them to bless your journey',
            buttons: [
                {
                    text: 'A: Offer a Card', //aka option 1
                    nextStage: 1,
                    effects: [{ kind: 'choose_card_to_sacrifice' }],
                },
                {
                    text: 'B: Leave', //aka option 2
                    nextStage: 2,
                    effects: [],
                },
            ],
        },
        {
            //1 aka option 2
            displayText:
                'You move along, but still feel mysterious eyes upon you.',
            buttons: [],
        },
    ],
};
