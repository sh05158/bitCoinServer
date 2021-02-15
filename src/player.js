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
}

Player.signup = function(msg, cb){
    var player = new Player();
    
    player.nickname = "nickname"+Math.floor(Math.random()*8999+1000);
    player.platform = msg.platform;
    player.uuid = msg.uuid;

    if(!msg.id){
        msg.id = null;
    }

    sql.query("INSERT INTO player (diamond, isGeneratedNickname, nicknameChangeAvailableCount, nickname, id, platform, level, gold, bitcoin, inventory, equipment, lastLoginTime,\
        chapter, stage, exp, expm, lastRequestTime, vipLevel, vipExp, vipExpm) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [player.diamond, player.isGeneratedNickname, player.nicknameChangeAvailableCount, player.nickname, msg.id, msg.platform, player.level, player.gold, player.bitcoin, JSON.stringify(player.inventory), JSON.stringify(player.equipment),
        player.lastLoginTime, player.chapter, player.stage, player.exp, player.expm, player.lastRequestTime,player.vipLevel,
    player.vipExp, player.vipExpm],function(err,res){

        if(!!err){
            cb(null);
            return;
        }

        sql.query("SELECT playerID FROM player WHERE id = ?",[msg.id],function(err2,res2){

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
            player.playerID         = playerID;
            player.nickname         = res[0].nickname;
            player.uuid             = res[0].uuid;
            player.platform         = res[0].platform;
            player.id               = res[0].id;
            player.level            = res[0].level;
            player.gold             = res[0].gold;
            player.bitcoin          = res[0].bitcoin;
            player.inventory        = JSON.parse(res[0].inventory);
            player.equipment        = JSON.parse(res[0].equipment);
            player.lastLoginTime    = res[0].lastLoginTime;
            player.chapter          = res[0].chapter;
            player.stage            = res[0].stage;
            player.exp              = res[0].exp;
            player.expm             = res[0].expm;
            player.lastRequestTime  = res[0].lastRequestTime;
            player.vipLevel         = res[0].vipLevel;
            player.vipExp           = res[0].vipExp;
            player.vipExpm          = res[0].vipExpm;
            player.diamond          = res[0].diamond;
            player.isGeneratedNickname          = res[0].isGeneratedNickname;
            player.nicknameChangeAvailableCount          = res[0].nicknameChangeAvailableCount;
    
            cb(player);
        });
    }

    sql.query("SELECT * FROM user WHERE uuid = ?",[uuid],function(err1,res1){

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

Player.updateNickname = function(msg, cb){
    sql.query("SELECT isGeneratedNickname, nicknameChangeAvailableCount FROM player WHERE playerID = ?",[msg.playerID],function(err,res){
        if(res[0].nicknameChangeAvailableCount >= 1){
            sql.query("UPDATE player SET (isGeneratedNickname, nicknameChangeAvailableCount, nickname) = (?,?,?) WHERE playerID = ? ",[0,res[0].nicknameChangeAvailableCount-1,msg.nickname],
            function(err2,res2){
                if(!!err || !!err2){
                    cb({
                        CODE : CODE.ERROR
                    });
                    return;
                }
                cb({
                    CODE : CODE.OK,
                    afterNickname : msg.nickname
                });
            })
        }
    })
}


module.exports = Player;