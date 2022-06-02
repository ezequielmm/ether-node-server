export class CreateEffectPipelineDTO {
    readonly client_id: string;
    readonly status: {
        resolve?: {
            value: number;
            turns: number;
        };
    };
}
