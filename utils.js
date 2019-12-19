function isJSONresponse(res) {
    return (
        res &&
        res.headers &&
        res.headers.get('content-type') &&
        typeof res.headers.get('content-type') === 'string' &&
        res.headers.get('content-type').indexOf('application/json') !== -1
    )
}

function fromEntries(entries) {
    return Array.from(entries).reduce((obj, [key, value]) => {
        obj[key] = value
        return obj
    }, {})
}


function* pageOffsets(numItems, pageSize, overlap = 0) {
    const realSize = pageSize - overlap,
        numPages = Math.ceil(numItems / realSize) + 1
    for (let i = 0; i < numPages; i++) {
        yield realSize * i
    }
}


module.exports = { fromEntries, isJSONresponse, pageOffsets }
