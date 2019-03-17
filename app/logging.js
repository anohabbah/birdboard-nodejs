const { transports, exceptions } = require('winston');

/**
 * Event handler
 * @param {Error} ex
 */
function onEventsHandler(ex) {
  throw ex;
}

exceptions.handle(
  new transports.File({ filename: 'uncaught-exception.log' }),
  new transports.Console({ colorize: true, prettyPrint: true })
);
// process.on('uncaughtException', onEventsHandler);
process.on('unhandledRejection', onEventsHandler);
