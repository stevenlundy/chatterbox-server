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
  res.send("You did it!");

});
// app.get('/', function (req, res) {
//   var options = {
//       root: __dirname + '../client/',
//       dotfiles: 'deny',
//       headers: {
//           'x-timestamp': Date.now(),
//           'x-sent': true
//       }
//     };
//   var fileName = "index.html";
//   debugger;
//   res.sendFile(fileName, options, function (err) {
//     if (err) {
//       console.log(err);
//       res.status(err.status).end();
//     }
//     else {
//       console.log('Sent:', fileName);
//     }
//   });
// });

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});







// /* Import node's http module: */
// var http = require("http");
// var requestHandler = require("./request-handler.js").requestHandler;

// // Every server needs to listen on a port with a unique number. The
// // standard port for HTTP servers is port 80, but that port is
// // normally already claimed by another server and/or not accessible
// // so we'll use a standard testing port like 3000, other common development
// // ports are 8080 and 1337.
// var port = 3000;

// // For now, since you're running this server on your local machine,
// // we'll have it listen on the IP address 127.0.0.1, which is a
// // special address that always refers to localhost.
// var ip = "127.0.0.1"; // 10.6.1.25



// // We use node's http module to create a server.
// //
// // The function we pass to http.createServer will be used to handle all
// // incoming requests.
// //
// // After creating the server, we will tell it to listen on the given port and IP. */
// var server = http.createServer(requestHandler);
// console.log("Listening on http://" + ip + ":" + port);
// server.listen(port, ip);

// // To start this server, run:
// //
// //   node basic-server.js
// //
// // on the command line.
// //
// // To connect to the server, load http://127.0.0.1:3000 in your web
// // browser.
// //
// // server.listen() will continue running as long as there is the
// // possibility of serving more requests. To stop your server, hit
// // Ctrl-C on the command line.

