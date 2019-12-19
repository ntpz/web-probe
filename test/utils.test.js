const expect = require('chai').expect

const { isJSONresponse, fromEntries, pageOffsets } = require('../utils')

describe('isJSONresponse', () => {
    it('Returns true for json response', () => {
        const response = {
            headers: new Map([['content-type', 'application/json']]),
        }
        expect(isJSONresponse(response)).to.be.true
    })

    it('Returns false for non-json response', () => {
        const response = {
            headers: new Map([['content-type', 'text/plain']]),
        }
        expect(isJSONresponse(response)).to.be.false
    })
})

describe('fromEntries', () => {
    it('Constructs object from key-value pairs', () => {
        const obj = fromEntries([
            ['a', 1],
            ['b', 2],
        ])
        expect(obj).to.deep.equal({ a: 1, b: 2 })
    })
})

describe('pageOffsets', () => {
    it('Generates 6 10-item pages for 42 items', () => {
        const offsets = Array.from(pageOffsets(42, 10))
        expect(offsets).to.eql([0, 10, 20, 30, 40, 50])
    })

    it('Generates 7 8-item pages for 42 items with overlap factor of 2', () => {
        const offsets = Array.from(pageOffsets(42, 10, 2))
        expect(offsets).to.eql([0, 8, 16, 24, 32, 40, 48])
    })
})
