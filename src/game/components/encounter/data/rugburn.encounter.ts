import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const RugburnEncounter: Encounter = {
    encounterId: EncounterIdEnum.Rugburn,
    encounterName: 'Rugburn',
    stageNumber: 1,
    imageId: 'rugburn',
    stages: [
        {
            //0
            displayText:
                'An ornate rug levitates out from between the trees, its edges limned in fire. It stops a few feet from you at eye level before slowly floating to the ground. You hear a faint whisper in the back of your mind that grows louder as you turn your attention towards it.\n' +
                '“Fancy a ride?” whispers the voice.',
            buttons: [
                {
                    text: 'Click here to step on the rug [Lose 10 HP, go for a ride]',
                    nextStage: 1, //aka option 1
                    effects: [
                        { kind: 'hit_points', amount: '-10' },
                        { kind: 'trinket', item: 'skip_three_nodes' },
                    ],
                },
                {
                    text: 'Click here to GTFO [Nothing happens]', //aka option 2
                    nextStage: 2,
                    effects: [],
                },
            ],
        },
        {
            //1 aka option 1
            displayText:
                'You step cautiously onto the rug. The flames are hot but bearable. It rises effortlessly and gains momentum as it weaves in between the trees. You pass over a few creatures but you’re moving too quickly to identify them. Before you know it, the rug halts in mid-air and throws you face first into a grass clearing. You stand with a groan and turn to see the rug self-immolating. Nothing remains but a pile of ash and a crick in your neck.',
            buttons: [],
        },

        {
            //2 aka option 2
            displayText: 'Flaming telepathic rugs? Hard pass.',
            buttons: [],
        },
    ],
};
