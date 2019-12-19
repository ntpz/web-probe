const { pageOffsets } = require('./utils')

async function probe(download, extractor, spec) {
    if (spec.num_items) {
        const indexSpec = spec.num_items
        let response = await download(
            indexSpec.download.url,
            indexSpec.download.options
        )

        const numItems = extractor.extractField(indexSpec.extract, response)

        const urls = Array.from(
            pageOffsets(numItems, spec.items_per_page)
        ).map(offs => spec.download.url.replace('%OFFSET%', offs))

        const responses = await Promise.all(
            urls.map(async url => download(url, spec.download.options))
        )

        chunks = responses.map(res =>
            extractor.extractEntries(spec.extract, res)
        )
        return chunks.reduce((acc, el) => acc.concat(...el), [])
    } else {
        const response = await download(spec.download.url, {})
        return extractor.extractEntries(spec.extract, response)
    }
}

module.exports = { probe }
