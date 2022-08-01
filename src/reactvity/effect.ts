class ReactiveEffect {
    _fn: Function;
    constructor(fn_, public scheduler?: () => void ) {
        this._fn = fn_;
        this.scheduler = scheduler;
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
    for( const effect of dep) {
        if(effect.scheduler) {
            effect.scheduler();
        }else {
            effect.run();
        }
    }
}

export const effect = <T extends Function>(fn: T, options?:{
    scheduler?: () => void
}) => {
    const effectFn = new ReactiveEffect(fn, options?.scheduler);
    effectFn.run();
    const runner = effectFn.run.bind(effectFn);
    return runner;
}