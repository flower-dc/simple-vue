import { mutableHandler, readonlyHandler } from './baseHandler'

export const reactive = <T extends object>(raw: T) => {
    return createActiveObject(raw, mutableHandler)
}

export const readonly = <T extends object>(raw: T) => {
    return createActiveObject(raw, readonlyHandler)
}

const createActiveObject = <T extends object>(raw: T, handler: Record<string|symbol, any>) => {
    return new Proxy(raw, handler)
}