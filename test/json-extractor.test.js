const chai = require('chai')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)
const expect = require('chai').expect

const { extractEntries, extractField } = require('../json-extractor.js')

describe('JSON extractor', () => {
    it('Returns empty array if no rows found', () => {
        const data = {
            persons: [],
        }
        const spec = {
            rows: { selector: '$.persons' },
            fields: {
                name: { selector: '$.name' },
            },
        }
        const result = extractEntries(spec, data)
        expect(result)
            .to.be.array()
            .ofSize(0)
    })

    it('Returns empty array row selector doesnt match', () => {
        const data = {}
        const spec = {
            rows: { selector: '$.persons' },
            fields: {
                name: { selector: '$.name' },
            },
        }
        const result = extractEntries(spec, data)
        expect(result)
            .to.be.array()
            .ofSize(0)
    })

    it('Extracts multiple entries according to rules', () => {
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

    it('Works if row selector selects non-list', () => {
        const data = {
            persons: {
                name: 'Alice',
            },
        }

        spec = {
            rows: { selector: '$.persons' },
            fields: {
                name: { selector: '$.name' },
            },
        }

        const result = extractEntries(spec, data)
        expect(result)
            .to.be.array()
            .ofSize(1)
        expect(result[0]).to.eql({ name: 'Alice' })
    })

    it('Extracts single field according to rules', () => {
        const rules = { selector: '$.answer' }
        const data = { answer: 42 }
        result = extractField(rules, data)
        expect(result).to.equal(42)
    })
})
