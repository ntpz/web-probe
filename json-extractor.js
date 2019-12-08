const jp = require('jsonpath')

const { fromEntries } = require('./utils')

function extractEntries(spec, data) {
    return extractRows(spec.rows, data).map(row => extractRow(spec.fields, row))
}

function extractRows(rowSpec, data) {
    return jp.query(data, rowSpec.selector)[0]
}

function extractRow(fieldSpecs, row) {
    const fieldSpecsArray = Object.entries(fieldSpecs)
    const fieldValuesArray = fieldSpecsArray.map(([alias, rules]) => [
        alias,
        extractField(alias, rules, row),
    ])
    return fromEntries(fieldValuesArray)
}

function extractField(alias, rules, row) {
    return jp.query(row, rules.selector)[0]
}

module.exports = { extractEntries }
