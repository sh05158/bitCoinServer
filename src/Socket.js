const sql = require('../mysql');
var CODE = require('./code');
// var Game = require('./Game');
var SIG           = require('./signal'),
      Color         = require('../colorConsole'),
      Config        = require('../config.json'),
      Util          = require('./Util'),
      CODE          = require('./code');

var Player = require('./player');
const   shop = require('./shop'),
        score = require('./score'),
        equipment = require('./equipment'),
        inventory = require('./inventory');
const coin = require('./coin');
// const { getItem } = require('./inventory');
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
        
        var currPlayer = null;


        Color.green('Player in : ',SocketManager.playerList.length);

        socket.on(SIG.HAND_SHAKE, (msg, cb)=>{
            console.log('handshake uuid ',msg.uuid);
            sql.query("SELECT * FROM user WHERE uuid = ?",[msg.uuid],function(err,res){

                if(!!err){
                    cb({
                        CODE : CODE.ERROR,
                        reason : 'query error'
                    });
                    return;
                }

                console.log("쿼리 결과 ",err,res);

                var platform = null;

                if(res.length === 0){
                    isNewUser = true;
                    cb({
                        CODE : CODE.OK,
                        isNewUser : true,
                    });
                    return;
                } else {
                    if(res.length > 1){
                        cb({
                            CODE : CODE.ERROR,
                            reason : 'uuid가 2개 이상 존재합니다'
                        });
                        return;
                    }
                    
                    var platform;

                    if(res[0].id !== null){
                        platform = 'google';
                    } else {
                        platform = 'guest';
                    }

                    cb({
                        CODE : CODE.OK,
                        isNewUser : false,
                        platform : platform
                    });
                    return;
                }


            });

        });

        socket.on(SIG.LOGIN, (msg, cb)=>{

            /* 플레이어 메모리에 담아놓고 써야지 */

            // player = Player.loadPlayer( msg.playerID );

            /*                          */

            var setPlayer = function(player){
                currPlayer = player;
                currPlayer.loginCount++;
                currPlayer.lastLoginTime = new Date().getTime();
                currPlayer.scoreSum = score.getScoreSum(currPlayer);
            }

            Color.green('LOGIN uuid ',msg.uuid, msg.platform, msg.id);

            if(msg.platform === 'guest'){

                sql.query("SELECT * FROM user WHERE uuid = ?",[msg.uuid],function(err,res){
                    if(!!err){
                        cb({
                            CODE : CODE.ERROR,
                            reason : 'query error'
                        });
                        return;
                    }

                    if(res.length === 0){
                        Player.signup(msg, function(player){


                            if(!player){
                                cb({
                                    CODE : CODE.ERROR,
                                    reason : 'signup failed'
                                });
                                return;
                            }



                            setPlayer(player);
                            

                            cb({
                                player : player,
                                CODE : CODE.OK,
                                isAccountCreated : true
                            });


                        });
                    } else if(res.length === 1){
                        Player.loginPlayer(msg, res[0].playerID, function(player){
                            console.log("플레이어 ",JSON.stringify(player));
                            if(!player){
                                cb({
                                    CODE : CODE.ERROR,
                                    reason : 'login failed'
                                });
                                return;
                            }

                            setPlayer(player);


                            cb({
                                player : player,
                                CODE : CODE.OK,
                                isAccountCreated : false
                            });
                        });
                        
                    } else {
                        cb({
                            // player : player,
                            CODE : CODE.ERROR,
                            reason : '로그인 결과가 2개 이상입니다'
                        });
                    }
                });

            } else {
                sql.query("SELECT * FROM user WHERE id = ?",[msg.id],function(err,res){
                    if(!!err){
                        cb({
                            CODE : CODE.ERROR,
                            reason : 'query error.'
                        });
                        return;

                    }
                    if(res.length === 0){
                        //db에 데이터 없는 구글 유저
                        Player.signup(msg, function(player){
                            if(!player){
                                cb({
                                    CODE : CODE.ERROR,
                                    reason : '회원가입중 쿼리 에러발생'
                                })
                                return;
                            }

                            setPlayer(player);


                            cb({
                                player : player,
                                CODE : CODE.OK,
                                isAccountCreated : true
                            });
                        });
                    } else {
                        Player.loginPlayer(msg, res[0].playerID, function(player){
                            if(!player){
                                cb({
                                    CODE : CODE.ERROR,
                                    reason : '로그인중  쿼리 에러발생'
                                })
                                return;
                            }

                            setPlayer(player);

                            cb({
                                player : player,
                                CODE : CODE.OK,
                                isAccountCreated : false
                            });
                        });
                    }
                    
                });
            }

        });

        socket.on(SIG.NICKNAME_UPDATE, (msg, cb)=>{
            Player.updateNickname(msg, currPlayer, cb);

        });

        socket.on(SIG.REQUEST_SHOP_PRODUCT, (msg, cb)=>{
            shop.getShop(currPlayer, msg, cb);
        });

        socket.on(SIG.REQUEST_BUY_ITEM, (msg, cb)=>{
            shop.buyItem(currPlayer, msg, cb);
            Player.updatePlayer(currPlayer.playerID, currPlayer);
        });

        socket.on(SIG.REQUEST_IDLE_REWARD, (msg, cb)=>{
            var getCoin = score.getMiningCoin(currPlayer);

            if(getCoin === 0){
                cb({
                    CODE : CODE.ERROR,
                    coinType : coin.coinType.BITCOIN,
                    coin     : 0,
                    reason   : '채굴된 양이 0입니다'
                });

                console.log('player ',currPlayer.playerID,'채굴코인 0');

            }
            else {

                Player.setLastRequestTimeNow(currPlayer);
                Player.addBitcoin(currPlayer, getCoin);

                
                cb({
                    CODE : CODE.OK,
                    coinType : coin.coinType.BITCOIN,
                    coin     : getCoin
                });

                console.log('player ',currPlayer.playerID,'코인 수령 ',getCoin);




            }



            // Player.updatePlayer(currPlayer.playerID, currPlayer);

            



        });

        
        socket.on('disconnect', () => {
            //소켓 끊김 (종료)
            console.log('user disconnected');

            if(!currPlayer){
                return;
            }

            Player.updatePlayer(currPlayer.playerID, currPlayer, function(err,res){
                if(err){
                    console.log("ERROR ----- updatePlayer "+currPlayer.playerID+" error");
                }

                console.log('save complete ',currPlayer.playerID);
            });
            // SocketManager.playerList.splice(SocketManager.playerList.indexOf(this.findPlayerBySocket(socket)),1);
        });


      
    });
}

module.exports = SocketManager;