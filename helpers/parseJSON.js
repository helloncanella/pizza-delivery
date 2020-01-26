function parseJSON(string) {
  try {
    return JSON.parse(string);
  } catch {
    return {};
  }
}

module.exports = parseJSON;
