// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socket = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socket(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function (request, response) {
	response.sendFile(path.join(__dirname, 'index.html'));
});

// Starts the server
server.listen(5000, function () {
	console.log('Starting server on port 5000');
});


var players = {};
// Add the WebSocket handlers
io.on('connection', function(socket) {
	socket.on('new player', function () {
		players[socket.id] = { x: 300, y: 300 }
	});
	socket.on('movement', function (data) {
		var player = players[socket.id] || {};
		if (data.left) player.x -= 5;
		if (data.up) player.y -= 5;
		if (data.right) player.x += 5;
		if (data.down) player.y += 5;
	})
});

setInterval(() => io.sockets.emit('state', players), 1000 / 60);