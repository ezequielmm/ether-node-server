import { Encounter } from '../encounter.schema';
import { EncounterIdEnum } from '../encounter.enum';

export const MossyTrollEncounter: Encounter = {
    encounterId: EncounterIdEnum.MossyTroll,
    imageId: 'mossy_troll',
    stages: [
        {
            // 0
            displayText:
                'As you come around a bend, you spot a hunched over Troll, covered in moss, slowly swaying back and forth. He looks up and acknowledges your arrival with a wave. “Hi, friend,” he grumbles in his low, rocky voice. “Don’t mind me, just looking for my brother.”',
            buttons: [
                {
                    text: 'A: Offer to help', // aka option 1
                    nextStage: 1,
                    effects: [],
                },
                {
                    text: 'B: Offer condolences',
                    nextStage: 2,
                    effects: [],
                },
            ],
        },
        {
            // 1 aka option 1
            displayText:
                'The Troll smiles a lazy smile. “That’s awfully kind of you but I don’t know how you could. Maybe if you see him, just tell him Brimble is waiting for him in the glade, he’ll know the one. Give him this so he knows it’s me, would you? He hasn’t been acting himself lately.” The Troll produces a (curse card) from his pocket and hands it to you.',
            buttons: [
                {
                    text: 'A: Accept [Take Curse card]', // aka option 3
                    nextStage: 3,
                    effects: [{ kind: 'brimbles_quest' }],
                },
                {
                    text: 'B: Refuse', // aka option 4
                    nextStage: 2,
                    effects: [],
                },
            ],
        },
        {
            // 2 aka option 2
            displayText:
                'The troll nods and returns to staring at the ground. You sense he needs help but decide to continue on your path instead.',
            buttons: [],
        },
        {
            // 3 aka option 3
            displayText:
                'You take the (curse card) from the troll and stuff it in your pocket. You hope you can help the troll find his brother.',
            buttons: [],
        },
        {
            // 4 aka option 4
            displayText:
                'You’re wary of strangers and don’t quite like the idea of accepting the (curse card) from the strange, sad troll. You politely decline and turn to head further into the forest. “That’s ok,” says the troll. “He’s probably gone anyways…',
            buttons: [],
        },
    ],
};
