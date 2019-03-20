const { createLogger, transports } = require('winston');

const logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' })
  ]
});

module.exports = (err, req, res, next) => {
  logger.error(err.message);
  res.status(500).send('Something went wrong');
};
