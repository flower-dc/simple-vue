import { track, trigger } from "./effect";

export const createGetter = <T extends Record<string|symbol, any>>(isReadonly = false) => {
    return function(target: T, key:string | symbol) {
        const value = Reflect.get(target,key)
        !isReadonly && track(target, key);
        return value;
    }
}

export const createSetter = <T extends Record<string|symbol, any>>() => {
    return function(target: T, key:string | symbol, value: any, receiver: any) {
        const result = Reflect.set(target, key, value, receiver);
        trigger(target, key);
        return result;
    }
}

const get = createGetter();
const readonlyGet = createGetter(true);
const set = createSetter();

export const mutableHandler = {
    get,
    set
}

export const readonlyHandler = {
    get: readonlyGet,
    set(target, key, value, receiver) {
        console.warn(`${key} can't be set, because ${target} is readonly`);
        return true;
    }
}