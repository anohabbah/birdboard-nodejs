/**
 * Data Parser
 * @param {any} model
 * @return {any}
 */
function parseData(model) {
  return JSON.parse(JSON.stringify(model));
}

exports.parseData = parseData;
