var express = require('express');
var router = express.Router();
require('dotenv').config()

var authToken = process.env.AUTH;

router.get('/authToken', function(req, res) {
  res.send(authToken);
});

module.exports = router;
