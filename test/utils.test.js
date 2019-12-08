const expect = require('chai').expect

const { isJSONresponse, fromEntries } = require('../utils')

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
