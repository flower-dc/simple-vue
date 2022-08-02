class ReactiveEffect {
    public deps: Set<ReactiveEffect>[] = [];
    private clearable = true;
    constructor(
            private _fn: () => any, 
            public scheduler?: () => any,
            private onStop?: () => any
        ) {
    }
    run() {
        activeEffect = this;
        this._fn();
    }
    stop() {
        if(this.clearable) {
            cleanup(this);
            this.onStop && this.onStop();
            this.clearable = false;
        }
    }
}

const cleanup = (effect: ReactiveEffect) => {
    effect.deps.forEach(d => {
        d.delete(effect);
    })
}

let activeEffect: ReactiveEffect | null = null;

const targetMap:WeakMap<object, Map<string|symbol, Set<ReactiveEffect>>> = new WeakMap();

export const track = <T extends object>(target:T, key:string|symbol) => {
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
    activeEffect && dep.add(activeEffect) && activeEffect.deps.push(dep);
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