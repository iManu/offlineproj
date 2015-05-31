/* globals io */
/**
 * = notifications.js
 */

var userName = sessionStorage.userName || $.trim(prompt('Qui es-tu ?'));
if (userName) {
  sessionStorage.userName = userName;
} else {
  userName = 'Anonymous ' + _.random(0, 100);
}

exports.userName = userName;

var store = require('lib/persistence'),
  socket = io.connect();
socket.on('checkin', store.addCheckIn);
