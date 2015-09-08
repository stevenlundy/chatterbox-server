var express = require('express');
var path = require('path');
var fs = require('fs');
var messageLog = require('./message-log.js');
var app = express();
var bodyParser = require('body-parser');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('../client/'));

app.get('/classes/*', function(req, res){
  var order = req.query.order;
  var results = messageLog.read(order);
  res.send({ results: results });
});

app.post('/classes/*', function(req, res){
  messageLog.write(req.body);
  res.sendStatus(201);

});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
