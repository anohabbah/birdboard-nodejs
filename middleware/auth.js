const jwt = require('jsonwebtoken');

/**
 * Auth middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {*}
 */
function guard(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Unauthenticated');

  try {
    req.user = jwt.verify(token, process.env.JWT_TOKEN);
    next();
  } catch (e) {
    res.status(400).send('Invalid token');
  }
}

module.exports = guard;
