var BOSH_SERVICE = 'http://localhost:7070/http-bind/';
var connection = null;


var app = angular.module('vectorApp', []);
app.controller('ChatController', function($scope, $q) {

   var today = new Date();
   $scope.date = today.toDateString();
 });

function log(msg, data) {
    console.log(msg + ":" + data);
}

function rawInput(data)
{
    log('RECV', data);
}

function rawOutput(data)
{
    log('SENT', data);
}

function onConnect(status)
{
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

    	var reply = $msg({to: from, from: to, type: 'chat'})
                .cnode(Strophe.copyElement(body));
    	connection.send(reply.tree());

    	console.log('I sent ' + from + ': ' + Strophe.getText(body));
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
