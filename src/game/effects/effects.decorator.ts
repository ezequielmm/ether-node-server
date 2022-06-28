import { EffectName } from './effects.enum';

export const EFFECT_METADATA = 'effect:name';

export function Effect(name: EffectName): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(EFFECT_METADATA, name, target);
    };
}
