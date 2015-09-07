var _ = require('underscore');
var messageLog = {

  messages: [],

  read: function(){
    
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
    //console.log(message.text));
    //generate timestamp
    //generate unique ID
    //package into obj and input
  }
  
}

module.exports = messageLog;