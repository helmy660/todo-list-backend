var mysql = require("mysql");

module.exports = (options,mediator) => {
  const pool=mysql.createPool(options.dbSettings);
  mediator.emit('db.ready',pool);
}