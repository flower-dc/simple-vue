import { mutableHandlers, ReactiveFlags, readonlyHandlers, shallowHandlers } from './baseHandler'

export const reactive = <T extends object>(raw: T) => {
    return createActiveObject(raw, mutableHandlers)
}

export const readonly = <T extends object>(raw: T) => {
    return createActiveObject(raw, readonlyHandlers)
}

export const shallowReadonly = <T extends object>(raw: T) => {
    return createActiveObject(raw, shallowHandlers)
} 

const createActiveObject = <T extends object>(raw: T, handler: Record<string|symbol, any>) => {
    return new Proxy(raw, handler)
}

export const isReactive = (value:Record<string|symbol, any>) => {
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export const isReadonly = (value: Record<string|symbol, any>) => {
    return !!value[ReactiveFlags.IS_READONLY]
}