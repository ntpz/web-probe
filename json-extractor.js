const jp = require('jsonpath');

function fromJSON(selector, obj) {
    return jp.query(obj, selector);
}

module.exports = {fromJSON};
