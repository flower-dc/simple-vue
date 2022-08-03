import { isReactive, reactive, readonly } from '../reactive'
describe("reactive", () => {
    it("happy path", () => {
        const origin = {
            x: 1
        }
        const proxy = reactive(origin);
        expect(origin).not.toBe(proxy);
        expect(proxy.x).toBe(1);
    })
    it("isReactive", () => {
        const obj = reactive({x:1})
        expect(isReactive(obj)).toBe(true)
        const raw = {x:1}
        expect(isReactive(raw)).toBe(false)
    })
})