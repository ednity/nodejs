// set ENV
switch (process.env.NODE_ENV) {
  case 'production':
    var PORT = 3001;
    break;
  case 'staging':
    var PORT = 34543;
    break;
  default:
    var PORT = 3333;
    break;
};

var SSL_KEY = './ssl/ednity-staging_key.pem';
var SSL_CERT = './ssl/ednity-staging_cert.pem';


require('newrelic');
var https = require("https");
var url = require('url');
var socketio = require("socket.io");
var fs = require("fs");

var options = {
  key  : fs.readFileSync(SSL_KEY).toString(),
  cert : fs.readFileSync(SSL_CERT).toString(),
  ca: [ fs.readFileSync(SSL_CERT) ],
  NPNProtocols: ['http/1.1', 'spdy/3']
}

var server = https.createServer(options,function(req, res) {
    res.writeHead(200);
    res.end('are you ednitied?');
}).listen(PORT);

var io = socketio.listen(server);

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
  socket.on("notification", function (data) {
    socket
      .broadcast.to(data.group_id).emit("notification", { type: "ping" });
  });
});
