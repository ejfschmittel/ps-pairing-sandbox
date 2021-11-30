import { validate } from "./utils"

// TODO: oh noes, some cases might be missing here

describe('validate', () => {
    it('should accept Mike_Standish', () => {
        expect(validate("Mike_Standish")).toBe(true)
    })

    it('should reject Mike Standish', () => {
        expect(validate("Mike Standish")).toBe(false)
    })

    it('should reject Mike__Standish', () => {
        expect(validate("Mike__Standish")).toBe(false)
    })

    it('should reject MikeStandish_', () => {
        expect(validate("MikeStandish_")).toBe(false)
    })

    it('should reject Mik', () => {
        expect(validate("Mik")).toBe(false)
    })

    it('should accept', () => {
        expect(validate("Mike")).toBe(true)
    })

    it('should accept Mike123', () => {
        expect(validate("Mike123")).toBe(true)
    })

})