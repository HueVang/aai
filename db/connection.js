var pg = require('pg');
require('dotenv').config()

var pool = new pg.Pool({
  host: process.env.HOST,
  database: process.env.DB,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: '5432'
});

module.exports = pool;
