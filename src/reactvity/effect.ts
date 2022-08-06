let activeEffect: ReactiveEffect | null = null;
let shouldTrack = true;
class ReactiveEffect {
    public deps: Set<ReactiveEffect>[] = [];
    private active = true;
    constructor(
            private _fn: () => any, 
            public scheduler?: () => any,
            private onStop?: () => any
        ) {
    }
    run() {
        if(!this.active) return this._fn();
        activeEffect = this;
        shouldTrack = true;
        const res = this._fn();
        shouldTrack = false;
        return res;
    }
    stop() {
        if(this.active) {
            shouldTrack = false;
            cleanup(this);
            this.onStop && this.onStop();
            this.active = false;
        }
    }
}

const cleanup = (effect: ReactiveEffect) => {
    effect.deps.forEach(d => {
        d.delete(effect);
    })
    effect.deps.length = 0;
}

const targetMap:WeakMap<object, Map<string|symbol, Set<ReactiveEffect>>> = new WeakMap();

export const track = <T extends object>(target:T, key:string|symbol) => {
    if(!canTrack()) return;
    let depsMap = targetMap.get(target);
    if(!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep:Set<ReactiveEffect>|undefined = depsMap.get(key);
    if(!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    if(dep.has(activeEffect!)) return;
    dep.add(activeEffect!) && activeEffect!.deps.push(dep);
}

export const trigger = <T extends object>(target:T, key:string|symbol) => {
    const depsMap = targetMap.get(target);
    if(!depsMap) return;
    const dep:Set<ReactiveEffect>|undefined = depsMap.get(key);
    if(!dep || !dep.size) return;
    for(const effect of dep) {
        if(effect.scheduler) {
            effect.scheduler();
        }else {
            effect.run();
        }
    }
}

const canTrack = () => !!(activeEffect && shouldTrack);

type EffectRunner = {
    (): void;
    effect?: ReactiveEffect;
}

type effectOptions = {
    scheduler?: () => void;
    onStop?: () => void;
}

export const effect = (fn:() => any, options?:effectOptions) => {
    const effect = new ReactiveEffect(fn, options?.scheduler, options?.onStop);
    effect.run();
    const runner:EffectRunner = effect.run.bind(effect);
    runner.effect = effect;
    return runner;
}

export const stop = (runner:EffectRunner) => {
    runner?.effect!.stop();
}