import { EffectMetadata } from './effects.interface';

export const EFFECT_METADATA_KEY = 'effect';

export function EffectDecorator(metadata: EffectMetadata): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(EFFECT_METADATA_KEY, metadata, target);
    };
}
