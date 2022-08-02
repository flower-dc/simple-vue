import { reactive, effect } from '../';
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
        expect(onStop).toBeCalledTimes(1);
    })
})