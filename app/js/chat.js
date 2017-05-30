var BOSH_SERVICE = 'http://localhost:7070/http-bind/';
var connection = null;


var app = angular.module('vectorApp', []);
app.controller('ChatController', function($scope, $q) {

  var today = new Date();
  $scope.date = "";
  $scope.conversations = [];

   $scope.addchat = function (from, text) {
      console.log('Add Chat');
      var item = { date : new Date(), from : from, msg : text};
      console.log(item);
      $scope.conversations.push(item);
      console.log('Added Chat' + $scope.conversations);
      $scope.$apply();
      console.log($scope.conversations);
   }
 });

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

function onMessage(msg) {

    var to = msg.getAttribute('to');
    var from = msg.getAttribute('from');
    var type = msg.getAttribute('type');
    var elems = msg.getElementsByTagName('body');

    if (type == "chat" && elems.length > 0) {
    	var body = elems[0];

    	console.log('I got a message from ' + from + ': ' +
    	    Strophe.getText(body));

          console.log('On Mesage');
          angular.element($('#chatController')).scope().addchat(from, Strophe.getText(body));
          console.log('Message added');
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
