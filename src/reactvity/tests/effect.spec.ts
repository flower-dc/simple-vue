import { reactive, effect } from '../';
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
        // expect(count).toBe(24)
    })
})