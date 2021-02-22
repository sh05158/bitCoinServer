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
const inventory = require('./inventory');

const shop = require('./shop');

var buyType = {
    GOLD        : 0,
    DIAMOND     : 1,
}
var Player = function(){
    this.playerID        = null;
    this.nickname        = null;
    this.uuid            = null;
    this.platform        = null;
    this.id              = null;
    this.level           = 1;
    this.gold            = 0;
    this.bitcoin         = 0;
    this.inventory       = [];
    this.equipment       = {};
    this.lastLoginTime   = new Date().getTime();
    this.chapter         = 1;
    this.stage           = 1;
    this.exp             = 0;
    this.expm            = 100;
    this.lastRequestTime = new Date().getTime();
    this.vipLevel        = 1;
    this.vipExp          = 0;
    this.vipExpm         = 10;
    this.diamond             = 0;
    this.isGeneratedNickname = 1;
    this.nicknameChangeAvailableCount = 1;
    this.loginCount      = 0;

}

Player.signup = function(msg, cb){
    var player = new Player();
    
    player.nickname = "nickname"+Math.floor(Math.random()*8999+1000);
    player.platform = msg.platform;
    player.uuid = msg.uuid;

    if(!msg.id){
        msg.id = null;
    }

    var queryObj = Util.getQueryString(player);

    sql.query("INSERT INTO player ("+queryObj.variableStr+") VALUES("+queryObj.questionMarkStr+")",
        Util.getQueryArr(player),function(err,res){

        if(!!err){
            cb(null);
            return;
        }

        sql.query("SELECT playerID FROM player WHERE uuid = ?",[msg.uuid],function(err2,res2){

            if(!!err2){
                cb(null);
                return;
            }

            player.playerID = res2[0].playerID;
            player.id = msg.id;

            sql.query("INSERT INTO user (uuid, id, playerID) VALUES(?,?,?)",[msg.uuid, msg.id, player.playerID],function(err3,res3){

                if(!!err3){
                    cb(null);
                    return;
                }
        
                cb(player);
        
        
            });



        });
    });


    
    

}

Player.loginPlayer = function(msg, playerID, cb){

    Color.blue("로그인 시도 : ",playerID);

    var loginQuery = function(){
        sql.query("SELECT * FROM player WHERE playerID = ?",[playerID],function(err,res){

            if(err){
                cb(null);
                return;
            }

            Color.blue("로그인 결과 : ",err,res);
            var player = new Player();

            for(var key in res[0]){
                if(Util.IsJsonString(res[0][key])){
                    
                    player[key] = JSON.parse(res[0][key]);

                }
                else {

                    player[key] = res[0][key];
                
                }
            }
            // player.playerID         = playerID;
            // player.nickname         = res[0].nickname;
            // player.uuid             = res[0].uuid;
            // player.platform         = res[0].platform;
            // player.id               = res[0].id;
            // player.level            = res[0].level;
            // player.gold             = res[0].gold;
            // player.bitcoin          = res[0].bitcoin;
            // player.inventory        = JSON.parse(res[0].inventory);
            // player.equipment        = JSON.parse(res[0].equipment);
            // player.lastLoginTime    = res[0].lastLoginTime;
            // player.chapter          = res[0].chapter;
            // player.stage            = res[0].stage;
            // player.exp              = res[0].exp;
            // player.expm             = res[0].expm;
            // player.lastRequestTime  = res[0].lastRequestTime;
            // player.vipLevel         = res[0].vipLevel;
            // player.vipExp           = res[0].vipExp;
            // player.vipExpm          = res[0].vipExpm;
            // player.diamond          = res[0].diamond;
            // player.isGeneratedNickname          = res[0].isGeneratedNickname;
            // player.nicknameChangeAvailableCount          = res[0].nicknameChangeAvailableCount;
    
            cb(player);
        });
    }

    sql.query("SELECT * FROM user WHERE uuid = ?",[msg.uuid],function(err1,res1){

        if(err1){
            cb(null);
            return;
        }

        if(res1.length === 0){
            sql.query("INSERT INTO user (uuid, id, playerID) VALUES(?,?,?)", [msg.uuid, msg.id, playerID], function(err2,res2){

                if(err2){
                    cb(null);
                    return;
                }

                loginQuery();

            });
        } else {
            loginQuery();
        }


    });
    
}

Player.updateNickname = function(msg, player, cb){
    // sql.query("SELECT isGeneratedNickname, nicknameChangeAvailableCount FROM player WHERE playerID = ?",[msg.playerID],function(err,res){
    //     if(res[0].nicknameChangeAvailableCount >= 1){
    //         sql.query("UPDATE player SET (isGeneratedNickname, nicknameChangeAvailableCount, nickname) = (?,?,?) WHERE playerID = ? ",[0,res[0].nicknameChangeAvailableCount-1,msg.nickname, msg.playerID],
    //         function(err2,res2){
    //             if(!!err || !!err2){
    //                 cb({
    //                     CODE : CODE.ERROR
    //                 });
    //                 return;
    //             }
    //             cb({
    //                 CODE : CODE.OK,
    //                 afterNickname : msg.nickname
    //             });
    //         })
    //     }
    // })

    if(player.nicknameChangeAvailableCount >= 1){
        player.nicknameChangeAvailableCount--;
        player.isGeneratedNickname = 0;
        player.nickname = msg.nickname;

        cb({
            CODE : CODE.OK,
            afterNickname : msg.nickname
        });

        Player.updatePlayer(player.playerID, player);

    }
    else{
        cb({
            CODE : CODE.ERROR,
            reason : '닉네임 변경 가능 횟수 부족함'
        });
    }
    
}

Player.getPlayer = function(msg, cb){
    sql.query("SELECT * FROM player WHERE playerID = ?",[msg.playerID], function(err,res){
        if(err || !res || res.length < 1){
            cb(null);
            return;
        }
        cb(res);
    });
}

Player.createPlayer = function(player, cb){
    var sql1 = "";
    var sql2 = "";
    var keyArr = [];
    for(var key in player){
        keyArr.push(player[key]);
        sql1 += key.toString()+', ';
        sql2 += "? ,";
    }

    sql1 = sql1.substring(0,sql1.lastIndexOf(', '));
    sql2 = sql2.substring(0,sql2.lastIndexOf(', '));
    
    var query = 'INSERT INTO player ('+sql1+') VALUES('+sql2+')';

    sql.query(query, keyArr, function(err,res){
        if(err){
            cb(null);
            return;
        }

        cb(
            {
                CODE : CODE.OK
            }
        );


    });
}

Player.updatePlayer = function(playerID, data, cb){
    // var sql1 = "";
    // var sql2 = "";
    // var keyArr = [];
    // for(var key in data){
    //     keyArr.push(data[key]);
    //     sql1 += key.toString()+', ';
    //     sql2 += "?, ";
    // }

    // sql1 = sql1.substring(0,sql1.lastIndexOf(', '));
    // sql2 = sql2.substring(0,sql2.lastIndexOf(', '));
    
    // console.log(sql1);
    // console.log(sql2);

    var query = 'UPDATE player SET '+Util.getUpdateQuery(data)+ 'WHERE playerID = ?';

    sql.query(query, [playerID], function(err,res){
        
        
        cb(err,res);


    });
}

Player.changeInventory = function(player, msg, cb){

}

Player.buyItem = function(player, msg, cb){
    var targetProduct = shop.getProductByCode(player, msg, cb);

    switch(msg.buyType){
        case buyType.GOLD:


            if(!targetProduct.item.price.gold){
                cb({
                    CODE:CODE.ERROR,
                    reason:'골드로 구입할 수 없는 아이템입니다'
                });
                return;
            }


            if(player.gold >= targetProduct.item.price.gold){
                player.gold -= targetProduct.item.price.gold;
                this.getItem(player, targetProduct.item);
                cb({
                    CODE        : CODE.OK,
                    targetItem  :   targetProduct.item,
                    player      : player
                });
            }
            else{
                cb({
                    CODE        : CODE.ERROR,
                    reason      : '골드가 부족합니다'
                });
            }
            break;
        case buyType.DIAMOND:

            if(!targetProduct.item.price.diamond){
                cb({
                    CODE:CODE.ERROR,
                    reason:'다이아로 구입할 수 없는 아이템입니다'
                });
                return;
            }

            if(player.diamond >= targetProduct.item.price.diamond){
                player.diamond -= targetProduct.item.price.diamond;
                this.getItem(player, targetProduct.item);
                cb({
                    CODE        :   CODE.OK,
                    targetItem  :   targetProduct.item 
                });
            }
            else{
                cb({
                    CODE        : CODE.ERROR,
                    reason      : '다이아가 부족합니다'
                });
            }
    }
}

Player.getItem = function(player, item, cb){
    
}

Player.equipItem = function(player, msg, cb){
    
}

Player.enchantItem = function(player, msg, cb){
    var targetItem = inventory.getInventory(player, msg);

    targetItem.enhance
}

module.exports = Player;