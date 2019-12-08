const chai = require('chai')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)
const expect = require('chai').expect

const { extractEntries } = require('../json-extractor.js')

describe('JSON extractor', () => {
    it('Should extract entries according to rules', () => {
        const data = {
            persons: [
                { name: 'Alice', age: 42 },
                { name: 'Bob', age: 43, alive: false },
            ],
        }
        const spec = {
            rows: { selector: '$.persons' },
            fields: {
                name: { selector: '$.name' },
                age: { selector: '$.age' },
            },
        }
        const result = extractEntries(spec, data)
        expect(result)
            .to.be.array()
            .ofSize(2)
        expect(result).to.deep.include({ name: 'Alice', age: 42 })
        expect(result).to.deep.include({ name: 'Bob', age: 43 })
    })
})
