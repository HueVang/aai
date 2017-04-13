var express = require('express');
var router = express.Router();
var config = {
  database: 'aai'
};
var pg = require('pg');
var pool = new pg.Pool(config);

require('dotenv').config()

// Retrieves authentication token and sends it to home.controller.
var authToken = process.env.AUTH;
router.get('/authToken', function(req, res) {
  res.send(authToken);
});

// Gets all the daily votes from the database for a specific user.
router.get('/votes/:id', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to votes DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM votes WHERE user_id=$1;',
      [req.params.id],
      function(err, result){
        done();
        if (err){
          console.log('Error querying votes from DB', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
          }
        });
    }
  });
}); // end router.get /votes

// Gets the date of the most recent vote for a specific user.
router.get('/dates/:id', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to dates DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('SELECT * FROM dates WHERE user_id=$1;',
      [req.params.id],
      function(err, result){
        done();
        if (err){
          console.log('Error querying dates from DB', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
          }
        });
    }
  });
}); // end router.get /dates

// Posts the user's ID, video ID, and the current date into the database.
// This keeps track of which video has a vote for a specific day.
router.post('/votes', function(req, res){
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to votes DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('INSERT INTO votes (user_id, video_id, date) VALUES ($1, $2, $3) RETURNING *;',
      [req.body.user_id, req.body.video_id, req.body.date],
      function(err, result){
        done();
        if (err){
          console.log('Error posting votes into DB', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
          }
        });
    }
  });
}); // end router.post /votes

// Posts the user's ID and the current date.
router.post('/dates', function(req, res){
  console.log('This is the request body', req.body);
  pool.connect(function(err, client, done){
    if(err){
      console.log('Error connecting to dates DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('INSERT INTO dates (user_id, date) VALUES ($1, $2) RETURNING *;',
      [req.body.user_id, req.body.date],
      function(err, result){
        done();
        if (err){
          console.log('Error posting dates into DB', err);
          res.sendStatus(500);
          }else{
            console.log('Got info from DB', result.rows);
            res.send(result.rows);
          }
        });
    }
  });
}); // end router.post /dates

// Deletes all votes on all the videos a user has voted for.
// Occurs when the user casts their first vote on a new day.
router.delete('/votes/:id', function(req, res){
  pool.connect(function(err, client, done){
    console.log(req.params.id);
    if (err) {
      console.log('Error connecting to votes DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('DELETE FROM votes WHERE user_id=$1',
      [req.params.id],
      function(err, result){
        done();
        if (err) {
          console.log('Error deleting votes', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

// Deletes the date tied to the user's most recent vote.
// Occurs whenever the user casts a vote on a new day.
router.delete('/dates/:id', function(req, res){
  pool.connect(function(err, client, done){
    console.log(req.params.id);
    if (err) {
      console.log('Error connecting to dates DB', err);
      res.sendStatus(500);
      done();
    } else {
      client.query('DELETE FROM dates WHERE user_id=$1',
      [req.params.id],
      function(err, result){
        done();
        if (err) {
          console.log('Error deleting dates', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

module.exports = router;
