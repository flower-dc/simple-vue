import { reactive } from '../reactive'
describe("reactive", () => {
    it("happy path", () => {
        const origin = reactive({
            x: 1
        })
        const proxy = reactive(origin);
        expect(origin).not.toBe(proxy);
        expect(proxy.x).toBe(1);
    })
})