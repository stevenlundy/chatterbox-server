var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var messageLog = {

  messages: [],

  read: function(sortKey){
    var results = this.messages.slice(-100);
    if(sortKey){
      results.sort(function(a, b){
        var multiplier = 1;
        if (sortKey.charAt(0) == '-'){
          multiplier = -1;
          sortKey = sortKey.substr(1);
        }
        if(a[sortKey] < b[sortKey]){
          return 1 * multiplier;
        } else if (a[sortKey] === b[sortKey]){
          return 0;
        } else {
          return -1 * multiplier;
        }
      });
    }
    return results;
  },

  //{"username":"Steve","text":"asdf","roomname":"lobby"}
  write:function(data){
    var message = {};
    message.text = data.text;
    message.username = data.username;
    message.roomname = data.roomname;
    message.createdAt = Date.now();
    message.objectId = this.messages.length;
    this.messages.push(message);
    fs.writeFile(path.join(__dirname, 'messageLog.JSON'), JSON.stringify(this.messages), function(err){
      if(err){
        console.log("There was an error: " + err);
      } else {
        console.log("File write success");
      }
    });
    console.log(message.text);
  },

  populateMessages: function(){

    fs.readFile(path.join(__dirname, 'messageLog.JSON'), function(err, data){
      if(!err){
        this.messages = JSON.parse(data.toString());
      }
    }.bind(this));
  }
  
}


messageLog.populateMessages();
module.exports = messageLog;