var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();

var connection = require('./db/connection');
connection.connect();

app.use(bodyParser.json());
app.use(express.static('public'));

var home = require('./routes/home.js');
app.use('/home', home);

app.get('/*', function(req, res){
  res.sendFile(path.join(__dirname, 'public/views/index.html'));
});

var server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port', server.address().port);
});
