const expect = require('chai').expect
const nock = require('nock')

const { probe } = require('../probe')
const { extractEntries } = require('../json-extractor.js')
const { download } = require('../downloader.js')

const TEST_HOST = 'https://fake.host/'

describe('Probe', () => {
    it('Obeys single-page spec', async () => {
        const fakeResponse = { persons: [{ name: 'Alice' }, { name: 'Bob' }] }
        const spec = {
            download: { url: TEST_HOST },
            extract: {
                rows: { selector: '$.persons' },
                fields: { name: { selector: '$.name' } },
            },
        }

        nock(TEST_HOST)
            .get('/')
            .reply(200, fakeResponse)

        const result = await probe(download, extractEntries, spec)

        expect(result)
            .to.be.array()
            .ofSize(2)
        expect(result).to.deep.include({ name: 'Alice' })
        expect(result).to.deep.include({ name: 'Bob' })
    })
})
