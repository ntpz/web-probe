const chai = require('chai')
const assertArrays = require('chai-arrays')
chai.use(assertArrays)
const expect = require('chai').expect

const { probe } = require('../probe')
const extractor = require('../json-extractor')
const { download } = require('../downloader')

describe('e2e tests', function() {
    before(function() {
        if (process.env.NODE_ENV !== 'TEST') {
            this.skip()
        }
    })
    it('Correctly probes single page', async function() {
        const spec = {
            download: {
                url: 'https://httpbin.org/get',
            },
            extract: {
                rows: { selector: '$.headers' },
                fields: {
                    host: { selector: '$.Host' },
                },
            },
        }
        const result = await probe(download, extractor, spec)
        expect(result)
            .to.be.array()
            .ofSize(1)
        expect(result).to.deep.include({ host: 'httpbin.org' })
    })
})
