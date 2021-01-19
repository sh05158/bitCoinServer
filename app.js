const SIG = require('./src/signal');
const Color = require('./colorConsole');
const Config = require('./config.json');

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const SocketManager = require('./src/Socket');

const request = require('request');

const externalip = require('externalip');

const https = require('http');
const sql = require('./mysql');

var cors = require('cors');
const { cyanBright } = require('chalk');

function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }

  return '0.0.0.0';
}

function getExternalIP(cb){

  try{
    var options = {
      host: 'ipv4bot.whatismyipaddress.com',
      port: 80,
      path: '/'
    };
    
    https.get(options, function(res) {
      console.log("status: " + res.statusCode);
    
      res.on("data", function(chunk) {
        cb(chunk);
      });
    }).on('error', function(e) {
      console.log("error: " + e.message);
    });

  } catch(exception){
    Color.red(exception);
  }
  
}


const Boot = function(){
  http.listen(Config.port, () => {
    Color.green('Server started --> port',Config.port);
  });

  app.get('/', cors(), (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  SocketManager.register(io);

  Color.blue('internal : ',getIPAddress());
  getExternalIP(function(ip){
    Color.blue('external : ',ip);
  });

}


Boot();

