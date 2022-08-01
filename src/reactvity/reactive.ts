import { track, trigger } from "./effect";

export const reactive = <T extends object>(raw: T) => {
    return new Proxy(raw, {
        get(target, key) {
            const value = Reflect.get(target, key);
            track(target, key);
            return value
        },
        set(target, key, value, receiver) {
            const oldValue = Reflect.get(target, key);
            if(oldValue === value) return false;
            const result = Reflect.set(target, key, value, receiver);
            trigger(target, key);
            return result;
        }
    })
}