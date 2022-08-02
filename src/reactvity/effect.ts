class ReactiveEffect {
    public deps: Set<ReactiveEffect>[] = [];
    private clearable = true;
    constructor(
            private _fn: () => void, 
            public scheduler?: () => void,
            private onStop?: () => void
        ) {
    }
    run() {
        activeEffect = this;
        this._fn();
    }
    stop() {
        if(this.clearable) {
            cleanupEffects(this);
            this.onStop && this.onStop();
            this.clearable = false;
        }
    }
}

const cleanupEffects = (effect: ReactiveEffect) => {
    effect.deps.forEach(d => {
        d.delete(effect);
    })
}

let activeEffect: ReactiveEffect | null = null;

const targetMap = new WeakMap();

export const track = (target, key) => {
    let depsMap = targetMap.get(target);
    if(!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep:Set<ReactiveEffect> = depsMap.get(key);
    if(!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    dep.add(activeEffect!);
    activeEffect?.deps.push(dep);
}

export const trigger = (target, key) => {
    const depsMap = targetMap.get(target);
    if(!depsMap) return;
    const dep:Set<ReactiveEffect> = depsMap.get(key);
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

export const effect = (fn:() => void, options?:effectOptions) => {
    const effect = new ReactiveEffect(fn, options?.scheduler, options?.onStop);
    effect.run();
    const runner:EffectRunner = effect.run.bind(effect);
    runner.effect = effect;
    return runner;
}

export const stop = (runner) => {
    runner.effect.stop();
}