var express = require('express');
var router = express.Router();
var _ = require('lodash');

var users = [];

router.get('/channels', function(req, res) {
  var channels = [
    {server: 'Ansible', type: 'normal', channels: ['general', 'server', 'client']},
    {server: 'Codeport', type: 'normal', channels: ['general', 'sqh', 'opensource']},
    {server: 'Ozinger', type: 'irc', channels: ['codeport', 'hongminhee', 'langdev']},
    {server: 'freenode', type: 'irc', channels: ['javascript', 'socket.io', 'react', 'slack']}
  ];
  res.send(channels);
});

router.get('/*', function(req, res) {
  res.render('index');
});

router.post('/join', function(req, res) {
  if (_.contains(users, req.body.username)) {
    res.status(409).json({result: false, msg: 'The username is already exist.'});
  } else {
    users.push(req.body.username);
    res.json({result: false});
  }
});

module.exports = router;
