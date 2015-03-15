module.exports = function(server) {
  var io = require('socket.io')(server, {
    transports: ['polling', 'websocket'],
    allowUpgrades: true
  });

  io.on('connection', function (socket) {
    console.log('connected');
    socket.on('message', function (msg) {
      socket.broadcast.send(msg);
    });
    socket.on('disconnect', function () {
      socket.broadcast.send('disconnected');
    });
  });
};
