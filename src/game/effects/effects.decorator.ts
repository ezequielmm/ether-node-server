import { EffectMetadata } from './effects.interface';

export const EFFECT_METADATA = 'effect';

export function EffectDecorator(metadata: EffectMetadata): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(EFFECT_METADATA, metadata, target);
    };
}
