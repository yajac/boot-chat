var BOSH_SERVICE = 'http://localhost:7070/http-bind/';
var connection = null;
var jid = null;


var app = angular.module('vectorApp', []);
app.controller('ChatController', function($scope, $q) {

  $scope.date = new Date();
  $scope.conversations = {};

   $scope.addchat = function (jid, from, text) {
      $scope.conversations[jid] = addToConversationArray($scope.conversations[jid], from, text, true);
      $scope.$apply();
   }

   $scope.chat = function (to, replyMessage) {
     chat(to, replyMessage);
     $scope.conversations[to] = addToConversationArray($scope.conversations[to], jid, replyMessage, false);
   }
 });

 function addToConversationArray(conversation, jid, text, self){
   if(conversation == null){
     conversation = [];
   }
   var chat = { date : new Date(), jid : jid, msg : text, self: self};
   conversation.push(chat);
   return conversation;
 }

 function chat(recipient, text){
   sendMessage(recipient, jid, text);
   $("#response-text").val("");
 }

function log(msg, data) {
    console.log(msg + ":" + data);
}

function rawInput(data){
    log('RECV', data);
}

function rawOutput(data){
    log('SENT', data);
}

function onConnect(status){
    if (status == Strophe.Status.CONNECTING) {
	    console.log('Strophe is connecting.');
    } else if (status == Strophe.Status.CONNFAIL) {
	    console.log('Strophe failed to connect.');
    } else if (status == Strophe.Status.DISCONNECTING) {
	    console.log('Strophe is disconnecting.');
    } else if (status == Strophe.Status.DISCONNECTED) {
	    console.log('Strophe is disconnected.');
    } else if (status == Strophe.Status.CONNECTED) {
	    console.log('Strophe is connected.');
      connection.addHandler(onMessage, null, 'message', null, null,  null);
      connection.send($pres().tree());
    }
}

function sendMessage(to, from, text){
  var message = $msg({to: to, from: from, type: 'chat'}).c("body").t(text)
	connection.send(message.tree());
}

function onMessage(msg) {

    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');

    jid = to;
    if (type == "chat" && elems.length > 0) {
    	var body = elems[0];
    	console.log('I got a message from ' + from + ': ' +
	    Strophe.getText(body));
      console.log('On Mesage');
      angular.element($('#chatController')).scope().addchat(from, from, Strophe.getText(body));
      console.log('Message added');
      $('#chatLabel').addClass('chatNotification');
    }
    // we must return true to keep the handler alive.
    // returning false would remove it after it finishes.
    return true;
}

$(document).ready(function () {
    connection = new Strophe.Connection(BOSH_SERVICE);
    connection.rawInput = rawInput;
    connection.rawOutput = rawOutput;

    connection.connect("testuser@yajac.test",
			       "testuser",
			       onConnect);

});

$("#chatTab").click(function() {
  $('#chatLabel').removeClass('chatNotification');
})
