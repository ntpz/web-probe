const expect = require("chai").expect;
const nock = require("nock");

const { download, isJSONresponse } = require("../downloader.js");

const TEST_HOST = "https://fake.host/";

describe("download", () => {
  it("Should fetch URL contents", async () => {
    nock(TEST_HOST)
      .get("/")
      .reply(200, { answer: 42 });

    const response = await download(TEST_HOST);

    expect(response.answer).to.be.equal(42);
  });

  it("Should send headers, specified in options", async () => {
    let headers;
    const scope = nock(TEST_HOST)
      .get('/')
      .reply(function (uri, requestBody) {
        headers = this.req.headers;
        return [200, 'Ok']
      });

    const response = await download(TEST_HOST, { headers: { 'x-test': 'yes' } });

    expect(headers['x-test'][0]).to.be.equal('yes');
  });

});


describe("isJSONresponse", () => {
  it("Should return true for json response", () => {
    const response = { headers: new Map([['content-type', 'application/json']]) };
    expect(isJSONresponse(response)).to.be.true;
  });
});
