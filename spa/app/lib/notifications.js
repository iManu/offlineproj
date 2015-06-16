// Notifications WebSockets
// ========================

'use strict';

/* global io */

var store = require('lib/persistence');

var userName = sessionStorage.userName ||
  $.trim(prompt('Votre nom d’utilisateur'));
if (userName)
  sessionStorage.userName = userName;
else
  userName = 'Anonymous' + _.random(1, 1000);

var socket = io.connect();
socket.on('checkin', store.addCheckIn);

exports.userName = userName;
