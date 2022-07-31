
class ReactiveEffect {
    _fn: Function;
    constructor(fn_) {
        this._fn = fn_;
    }
    run() {
        activeEffect = this;
        this._fn();
    }
}

let activeEffect: ReactiveEffect | null = null;

const targetMap = new WeakMap();

export const track = (target, key) => {
    let depsMap = targetMap.get(target);
    if(!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if(!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    dep.add(activeEffect);
}

export const trigger = (target, key) => {
    const depsMap = targetMap.get(target);
    if(!depsMap) return;
    const dep = depsMap.get(key);
    if(!dep) return;
    dep.forEach(effect => effect.run());
}

export const effect = <T extends Function>(fn: T) => {
    const effectFn = new ReactiveEffect(fn);
    effectFn.run();
}