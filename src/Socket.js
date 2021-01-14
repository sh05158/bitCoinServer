const { debug } = require('request');
var CODE = require('./code');
// var Game = require('./Game');
var SIG           = require('./signal'),
      Color         = require('../colorConsole'),
      Config        = require('../config.json'),
      Util          = require('./Util'),
      CODE          = require('./code');
    

var SocketManager = SocketManager || {};

SocketManager.playerList = [];

SocketManager.register = function(io){
    var self = this;
    this.io = io;

    io.on('connection', (socket) => {
        Color.blue('Socket Connected ',socket);
        Color.red(socket.id);

        // SocketManager.playerList.push(player);

        Color.green('Player in : ',SocketManager.playerList.length);
        socket.on('disconnect', () => {
            //소켓 끊김 (종료)
        console.log('user disconnected');
        // SocketManager.playerList.splice(SocketManager.playerList.indexOf(this.findPlayerBySocket(socket)),1);
        });


      
    });
}

module.exports = SocketManager;