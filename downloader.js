const fetch = require("node-fetch");

async function download(url, options) {
  let body;
  const res = await fetch(url);
  if (isJSONresponse(res)) {
    body = await res.json();
  } else {
    body = await res.text();
  }
  return body;
}

function isJSONresponse(res) {
  return (
    res &&
    res.headers &&
    res.headers.get("content-type") &&
    typeof res.headers.get("content-type") === "string" &&
    res.headers.get("content-type").indexOf("application/json") !== -1
  );
}

module.exports = {
  download,
  isJSONresponse
};
