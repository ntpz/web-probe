const expect = require('chai').expect
const nock = require('nock')

const { probe } = require('../probe')
const extractor = require('../json-extractor.js')
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

        const result = await probe(download, extractor, spec)

        expect(result)
            .to.be.array()
            .ofSize(2)
        expect(result).to.deep.include({ name: 'Alice' })
        expect(result).to.deep.include({ name: 'Bob' })
    })

    it('Obeys multi-page spec', async () => {
        nock(TEST_HOST)
            .get('/')
            .reply(200, { total_items: 2 })

        nock(TEST_HOST)
            .get('/')
            .query({ offset: 0 })
            .reply(200, { persons: [{ name: 'Alice' }] })

        nock(TEST_HOST)
            .get('/')
            .query({ offset: 1 })
            .reply(200, { persons: [{ name: 'Bob' }] })

        nock(TEST_HOST)
            .get('/')
            .query({ offset: 2 })
            .reply(200, { persons: [] })

        const spec = {
            num_items: {
                download: { url: `${TEST_HOST}` },
                extract: { selector: '$.total_items' },
            },
            items_per_page: 1,
            download: { url: `${TEST_HOST}?offset=%OFFSET%` },
            extract: {
                rows: { selector: '$.persons' },
                fields: { name: { selector: '$.name' } },
            },
        }

        const result = await probe(download, extractor, spec)

        expect(result)
            .to.be.array()
            .ofSize(2)
        expect(result).to.deep.include({ name: 'Alice' })
        expect(result).to.deep.include({ name: 'Bob' })
    })
})
