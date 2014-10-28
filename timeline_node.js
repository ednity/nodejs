if ('staging' == app.get('env')) {
  app.config = { logging: { LEVEL: 'DEBUG' } };
}


require('newrelic');
var http = require("http");
var url = require('url');
var socketio = require("socket.io");
var fs = require("fs");

var server = http.createServer().listen(process.env.VMC_APP_PORT || 3001);
var io = socketio.listen(server);

// notificationのping用
server.on('request', function(request, response) {
	var urlElements = url.parse(request.url, true);
	var query = urlElements.query;

	if (query.type == 'ping') {
		io.sockets.in(query.group_id).emit("notification", { type: "ping" });
	}
});


io.sockets.on("connection", function (socket) {

	/* Join room */
	socket.on('initialize', function(data) {
		socket.join(data.group_id);
	});

	/* Broadcast the data */
	socket.on("post", function (data) {
		socket
		.broadcast.to(data.group_id).emit("post", data)
		.broadcast.to(data.group_id).emit("notification", { type: "ping" });
	});
	socket.on("comment", function (data) {
		socket
		.broadcast.to(data.group_id).emit("comment", data)
		.broadcast.to(data.group_id).emit("notification", { type: "ping" });
	});
	socket.on("like", function (data) {
		socket
		.broadcast.to(data.group_id).emit("like", data)
		.broadcast.to(data.group_id).emit("notification", { type: "ping" });
	});
	socket.on("qa_answer", function (data) {
		socket
		.broadcast.to(data.group_id).emit("qa_answer", data)
		.broadcast.to(data.group_id).emit("notification", { type: "ping" });
	});
	socket.on("notification", function (data) {
		socket
		.broadcast.to(data.group_id).emit("notification", { type: "ping" });
	});
	socket.on("poll_check", function (data) {
		socket
		.broadcast.to(data.group_id).emit("poll_check", data);
		//.broadcast.to(data.group_id).emit("notification", { type: "ping" });
	});
});
