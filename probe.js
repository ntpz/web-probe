const { pageOffsets } = require('./utils')

async function subprobe(download, extractor, spec) {
    const { download: dlspec, extract: exspec } = spec
    const response = await download(dlspec.url, dlspec.options)
    return extractor.extractEntries(exspec, response)
}

function multipageSpecs(spec, numItems) {
    const offsets = Array.from(pageOffsets(numItems, spec.items_per_page))
    return offsets.map(offset => makePageSpec(spec, offset))
}

function makePageSpec(spec, offset) {
    let newSpec = JSON.parse(JSON.stringify(spec))
    newSpec.download.url = newSpec.download.url.replace('%OFFSET%', offset)
    return newSpec
}

async function probe(download, extractor, spec) {
    if (spec.num_items) {
        const indexResponse = await subprobe(
            download,
            extractor,
            spec.num_items
        )

        const numItems = parseInt(Object.entries(indexResponse[0])[0][1])
        const pspecs = multipageSpecs(spec, numItems)
        const chunks = await Promise.all(
            pspecs.map(
                async pspec => await subprobe(download, extractor, pspec)
            )
        )
        return chunks.reduce((acc, el) => acc.concat(...el), [])
    } else {
        return await subprobe(download, extractor, spec)
    }
}

module.exports = { probe }
