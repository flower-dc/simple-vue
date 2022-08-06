import { reactive, effect, isReadonly, readonly } from '../';
import { stop } from '../effect';
describe("effect", () => {
    it("happy path", () => {
        const user = reactive({
            age: 22
        })
        let count = 0
        // first execution
        effect(() => {
            count = user.age + 1
        })
        expect(count).toBe(23)
        // update
        user.age ++;
        expect(count).toBe(24)
    })
    it("scheduler", () => {
        let dumny,
            run;
        const scheduler = jest.fn(() => {
            run = runner;
        })
        const obj = reactive({x: 1})
        const runner = effect(() => {
            dumny = obj.x;
        }, {scheduler})
        expect(dumny).toBe(1);
        expect(scheduler).not.toHaveBeenCalled();
        obj.x++;
        expect(scheduler).toHaveBeenCalledTimes(1);
        run();
        expect(dumny).toBe(2);
    })

    it("stop", () => {
        let dummy;
        const onStop = jest.fn(() => {
            console.log('onStop')
        });
        const o = reactive({ x: 1 })
        const runner = effect(() => {
            dummy = o.x;
        }, { onStop })
        expect(dummy).toBe(1);
        stop(runner);
        o.x++;
        expect(dummy).toBe(1);
        runner();
        expect(dummy).toBe(2);
        expect(onStop).toBeCalledTimes(1);
    })

    it("nested happy path", () =>{
        const obj = readonly({
            count: 0,
            nested: {
                count: 0
            }
        })
        const obj1 = reactive({
            count: 0,
            nested: {
                count: 0
            }
        })
        expect(isReadonly(obj)).toBe(true);
        expect(isReadonly(obj.nested)).toBe(true);
        expect(isReadonly(obj1)).toBe(false);
        expect(isReadonly(obj1.nested)).toBe(false);
    })
})