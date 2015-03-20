module.exports = function(server) {
  var io = require('socket.io')(server, {
    transports: ['polling', 'websocket'],
    allowUpgrades: true
  });

  io.on('connection', function (socket) {
    var currentChannel;
    socket.on('message', function (msg) {
      socket.send(msg);
      socket.broadcast.send(msg);
    });
    socket.on('join', function (msg) {
      var room = msg.server + ':' + msg.channel;
      socket.join(room);
      currentChannel = room;
      msg.text = 'joined'
      socket.emit('joined', msg);
      socket.broadcast.to(room).send(msg);
    });
    socket.on('disconnect', function () {
      socket.broadcast.send('disconnected');
    });
  });
};
