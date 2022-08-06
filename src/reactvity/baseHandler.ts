import { track, trigger } from "./effect";
import { reactive, readonly } from "./reactive";
import { extend, isObject } from "./shared/ index";

export const enum ReactiveFlags {
    IS_REACTIVE = '__is_Reactive__',
    IS_READONLY = '__is_Readonly__'
}

export const createGetter = <T extends Record<string|symbol, any>>(isReadonly = false, shallow = false) => {
    return function(target: T, key:string | symbol) {
        if(key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }
        if(key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        const value = Reflect.get(target,key);

        if(shallow) return value;

        if(!isReadonly) track(target, key);

        if(isObject(value)) {
            return isReadonly ? readonly(value) : reactive(value);
        }

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
const shallowGet = createGetter(true, true);
const set = createSetter();

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    set(target, key, value, receiver) {
        console.warn(`${key} can't be set, because ${target} is readonly`);
        return true;
    }
}
export const shallowHandlers = extend({}, readonlyHandlers, {
    get: shallowGet
})