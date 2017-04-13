var pg = require('pg');
var pool = new pg.Pool({
  database: 'aai'
});

module.exports = pool;
