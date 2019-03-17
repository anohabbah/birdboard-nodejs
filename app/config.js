module.exports = function() {
  if (!process.env.JWT_TOKEN) {
    throw new Error('FATAL ERROR: JWT encryption key is missing.');
  }
};
