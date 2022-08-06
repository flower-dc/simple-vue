import { isReadonly, readonly, shallowReadonly } from '../reactive';
describe('readonly', () => {
    it("happy path", () => {
        const obj = {
            x:1
        };
        const readonlyObj = readonly(obj);
        expect(readonlyObj.x).toBe(1);
        expect(obj).not.toBe(readonlyObj)
    })

    it("can't set readonly property", () => {
        const obj = readonly({s:1})
        console.warn = jest.fn()
        obj.s = 2
        expect(console.warn).toBeCalled()
    })

    it("isReadonly", () => {
        const obj = readonly({s:1})
        expect(isReadonly(obj)).toBe(true)
        const raw = {s:1}
        expect(isReadonly(raw)).toBe(false)
    })

    it("shallow readonly", () => {
        const obj = shallowReadonly({
            x:1,
            y: {x:1}
        })
        expect(isReadonly(obj.y)).toBe(false);
        expect(isReadonly(obj)).toBe(true)
    })
})