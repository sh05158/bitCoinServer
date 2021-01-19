const { createConnection } = require('mysql2/promise');
const { debug } = require('request');
const sql = require('../mysql');
var CODE = require('./code');
// var Game = require('./Game');
var SIG           = require('./signal'),
      Color         = require('../colorConsole'),
      Config        = require('../config.json'),
      Util          = require('./Util'),
      CODE          = require('./code');
    //   sql           = require('../mysql');
    

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

        socket.on(SIG.HAND_SHAKE, (msg, cb)=>{
            console.log('handshake uuid ',msg.uuid);
            sql.query("SELECT uuid, platform, id FROM player",[],function(err,res){
                console.log("쿼리 결과 ",err,res);

                var isNewUser = true;
                var platform = null;
                var tempUser = null;

                for(var i = 0; i< res.length; i++){
                    var uuidArr = JSON.parse(res[i].uuid);
                    if(uuidArr.indexOf(msg.uuid) !== -1){
                        isNewUser = false;
                        tempUser = res[i];
                        platform = res[i].platform;
                        break;
                    }
                }

                if(!!tempUser){
                    console.log("tempuser 존재 ",{
                        CODE : CODE.OK,
                        isNewUser : isNewUser,
                        platform : tempUser.platform
                    });
                    cb({
                        CODE : CODE.OK,
                        isNewUser : isNewUser,
                        platform : tempUser.platform
                    });
                } else {
                    console.log("tempuser x ",{
                        CODE : CODE.OK,
                        isNewUser : isNewUser
                    });

                    cb({
                        CODE : CODE.OK,
                        isNewUser : isNewUser
                    });
                }
                
            });
        });


        socket.on(SIG.LOGIN, (msg, cb)=>{
            console.log('handshake uuid ',msg.uuid, msg.platform, msg.id);

            if(msg.platform === 'guest'){

                sql.query("SELECT uuid FROM player",[],function(err,res){
                    console.log("쿼리 결과 ",err,res);
    
                    var tempUser = null;
    
                    for(var i = 0; i< res.length; i++){
                        var uuidArr = JSON.parse(res[i].uuid);
                        if(uuidArr.indexOf(msg.uuid) !== -1){
                            tempUser = res[i];
                            break;
                        }
                    }

                    if(!tempUser){
                        sql.query("INSERT INTO player (uuid, platform) VALUES(?,?)",[JSON.stringify([msg.uuid]),msg.platform],function(err,res){
                            if(!err){
                                cb({
                                    CODE : CODE.OK,
                                    isAccountCreated : true
                                });
                            }
                        });
                    } else {
                        cb({
                            CODE : CODE.OK,
                            isAccountCreated : false
                        });
                    }

                });

            } else {
                sql.query("SELECT * FROM player WHERE id = ?",[msg.id],function(err,res){
                    if(res.length === 0){
                        //db에 데이터 없는 게스트 유저 
                        sql.query("INSERT INTO player (uuid, platform, id) VALUES(?,?,?)",[JSON.stringify([msg.uuid]),msg.platform,msg.id],function(err,res){
                            if(!err){
                                cb({
                                    CODE : CODE.OK,
                                    isAccountCreated : true
                                });
                            }
                        });
                    } else {
                        cb({
                            CODE : CODE.OK,
                            isAccountCreated : false
                        });
                    }
                    
                });
            }

            // sql.query("SELECT uuid FROM player",[],function(err,res){
            //     console.log("쿼리 결과 ",err,res);

            //     var isNewUser = false;

            //     for(var i = 0; i< res.length; i++){
            //         var uuidArr = JSON.parse(res[i].uuid);
            //         if(uuidArr.indexOf(msg.uuid) !== -1){
            //             isNewUser = true;
            //             break;
            //         }
            //     }

            //     cb({
            //         CODE : CODE.OK,
            //         isNewUser : isNewUser
            //     });
            // });
        });


        socket.on('disconnect', () => {
            //소켓 끊김 (종료)
            console.log('user disconnected');
            // SocketManager.playerList.splice(SocketManager.playerList.indexOf(this.findPlayerBySocket(socket)),1);
        });


      
    });
}

module.exports = SocketManager;