const { isJSONresponse } = require("./utils");

const fetch = require("node-fetch");

async function download(url, options) {
  let body;
  const res = await fetch(url, options);
  if (isJSONresponse(res)) {
    body = await res.json();
  } else {
    body = await res.text();
  }
  return body;
}

module.exports = {
  download
};
