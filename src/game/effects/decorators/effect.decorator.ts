export const EFFECT_METADATA = 'effect:name';

export function Effect(name: string): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(EFFECT_METADATA, name, target);
    };
}
