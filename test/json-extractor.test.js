const chai = require('chai');
const assertArrays = require('chai-arrays');
chai.use(assertArrays);
const expect = require("chai").expect;

const {fromJSON} = require('../json-extractor.js');


describe("JSON extractor", () => {
    it("Shuld extract scalar value from json document", () => {
        expect(fromJSON('$.answer', {answer: 42})).to.eql([42]);    
    });
});
