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

module.exports = { fromEntries, isJSONresponse }
