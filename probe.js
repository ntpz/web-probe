async function probe(download, extract, spec) {
    const response = await download(spec.download.url, {})
    return extract(spec.extract, response)
}

module.exports = { probe }
