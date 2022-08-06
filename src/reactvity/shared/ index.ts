export const extend = Object.assign;
export const isObject = (o: any) => o !== null && typeof o === 'object';
export const isArray = Array.isArray;
export const isFunction = (o: any) => typeof o === 'function';
export const isString = (o: any) => typeof o === 'string';
export const isSymbol = (o: any) => typeof o === 'symbol';
export const isUndefined = (o: any) => typeof o === 'undefined';
export const isNull = (o: any) => o === null;
export const isBoolean = (o: any) => typeof o === 'boolean';
export const isNumber = (o: any) => typeof o === 'number';
export const isRegExp = (o: any) => o instanceof RegExp;
export const isDate = (o: any) => o instanceof Date;
export const isError = (o: any) => o instanceof Error;
export const isArrayBuffer = (o: any) => o instanceof ArrayBuffer;
export const isPromise = (o: any) => o instanceof Promise;
export const isMap = (o: any) => o instanceof Map;
export const isSet = (o: any) => o instanceof Set;
export const isWeakMap = (o: any) => o instanceof WeakMap;
export const isWeakSet = (o: any) => o instanceof WeakSet;
export const isTypedArray = (o: any) => {
    return (
        o instanceof Int8Array ||
        o instanceof Uint8Array ||
        o instanceof Uint8ClampedArray ||
        o instanceof Int16Array ||
        o instanceof Uint16Array ||
        o instanceof Int32Array ||
        o instanceof Uint32Array ||
        o instanceof Float32Array ||
        o instanceof Float64Array
    );
}
