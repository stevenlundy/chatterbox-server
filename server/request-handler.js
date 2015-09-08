/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var messageLog = require("./message-log.js");
var fs = require("fs");
var path = require('path');
var mime = require('mime');
var url = require('url');


var messageHandler = function(request, response){
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";
  if(request.method === 'POST'){
    response.writeHead(201, headers);
    var messageData = '';
    request.on('data', function(chunk) {
      messageData += chunk;
    });

    request.on('end', function(){
      messageLog.write(JSON.parse(messageData));
    });
    response.end("{}");
  } else if(request.method === 'GET'){
    var params = url.parse(request.url, true).query;
    var results = messageLog.read();
    if(params.order){
      results.sort(function(a, b){
        var multiplier = 1;
        if (params.order.charAt(0) == '-'){
          multiplier = -1;
          params.order = params.order.substr(1);
        }
        if(a[params.order] < b[params.order]){
          return 1 * multiplier;
        } else if (a[params.order] === b[params.order]){
          return 0;
        } else {
          return -1 * multiplier;
        }
      });
    }
    response.writeHead(200, headers);
    response.end(JSON.stringify({ results: results }));
  } else {
    response.writeHead(200, headers);
    response.end("{}");
  } 
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log("Serving request type " + request.method + " for url " + request.url);

  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "application/json";

  if(request.url.indexOf('/classes/') !== -1){
    messageHandler(request, response);
  } else {
    
    headers['Content-Type'] = "text/html";
    //if URL is empty - build index file URL
    //else, build other URL
    var fileName = '';
    var subURL = request.url.split('?')[0];
    if(subURL === '/'){
      fileName = path.join(__dirname, '../client/index.html');
    } else {
      fileName = path.join(__dirname, '../client/' + subURL);
    }
    fs.readFile(fileName, function(err, data){
      if(!err){
        headers['Content-Type'] = mime.lookup(fileName);
        response.writeHead(200, headers);
        response.end(data.toString());
      } else {
        response.writeHead(404, headers);
        response.end("File not found");
      }
    });

  }
};

//'../client/' + subURL
// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports.requestHandler = requestHandler;
