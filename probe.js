async function probe(download, extractor, spec) {
    if (spec.num_items) {
        const indexSpec = spec.num_items
        response = await download(indexSpec.download.url)
        numItems = extractor.extractField(indexSpec.extract, response)
        const urls = Array.from(
            pageOffsets(numItems, spec.items_per_page)
        ).map(offs => spec.download.url.replace('%OFFSET%', offs))
        const responses = await Promise.all(
            urls.map(async url => download(url, {}))
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

function* pageOffsets(numItems, pageSize, overlap = 0) {
    const realSize = pageSize - overlap,
        numPages = Math.ceil(numItems / realSize) + 1
    for (let i = 0; i < numPages; i++) {
        yield realSize * i
    }
}

module.exports = { probe }
