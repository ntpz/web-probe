const jp = require('jsonpath')

const { fromEntries } = require('./utils')

function extractEntries(spec, data) {
    const rows = extractRows(spec.rows, data)
    return rows.map(row => extractRow(spec.fields, row))
}

function extractRows(rowSpec, data) {
    const rows = jp.query(data, rowSpec.selector)
    if (rows.length === 0) {
        return []
    }

    if (Array.isArray(rows[0])) {
        return rows[0]
    } else {
        return rows
    }
}

function extractRow(fieldSpecs, row) {
    const fieldSpecsArray = Object.entries(fieldSpecs)
    const fieldValuesArray = fieldSpecsArray.map(([alias, rules]) => [
        alias,
        extractField(rules, row, alias),
    ])
    return fromEntries(fieldValuesArray)
}

function extractField(rules, data, alias = 'unnamed') {
    return jp.query(data, rules.selector)[0]
}

module.exports = { extractEntries, extractField }
