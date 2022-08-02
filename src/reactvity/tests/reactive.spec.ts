import { reactive, readonly } from '../reactive'
describe("reactive", () => {
    it("happy path", () => {
        const origin = {
            x: 1
        }
        const proxy = reactive(origin);
        expect(origin).not.toBe(proxy);
        expect(proxy.x).toBe(1);
    })
    it("readonly", () => {
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
})