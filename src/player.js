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
    if(msg.id){
        sql.query("INSERT INTO player (diamond, isGeneratedNickname, nicknameChangeAvailableCount, nickname, id, uuid, platform, level, gold, bitcoin, inventory, equipment, lastLoginTime,\
            chapter, stage, exp, expm, lastRequestTime, vipLevel, vipExp, vipExpm) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [player.diamond, player.isGeneratedNickname, player.nicknameChangeAvailableCount, player.nickname, msg.id, JSON.stringify([msg.uuid]),msg.platform, player.level, player.gold, player.bitcoin, JSON.stringify(player.inventory), JSON.stringify(player.equipment),
           player.lastLoginTime, player.chapter, player.stage, player.exp, player.expm, player.lastRequestTime,player.vipLevel,
       player.vipExp, player.vipExpm],function(err,res){
           sql.query("SELECT playerID FROM player WHERE id = ?",[msg.id],function(err2,res2){
                player.playerID = res2[0].playerID;
                player.id = msg.id;
                Color.green("구글 계정 가입 playerID => ",player.playerID);
                cb(player);
           });
       });
    } else {
        sql.query("INSERT INTO player (diamond, isGeneratedNickname, nicknameChangeAvailableCount, nickname, uuid, platform, level, gold, bitcoin, inventory, equipment, lastLoginTime,\
            chapter, stage, exp, expm, lastRequestTime, vipLevel, vipExp, vipExpm) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [player.diamond, player.isGeneratedNickname, player.nicknameChangeAvailableCount,player.nickname, JSON.stringify([msg.uuid]),msg.platform, player.level, player.gold, player.bitcoin, JSON.stringify(player.inventory), JSON.stringify(player.equipment),
           player.lastLoginTime, player.chapter, player.stage, player.exp, player.expm, player.lastRequestTime,player.vipLevel,
       player.vipExp, player.vipExpm],function(err,res){

        sql.query("SELECT playerID, uuid FROM player",[],function(err,res){

            var tempUser = null;

            for(var i = 0; i< res.length; i++){
                var uuidArr = JSON.parse(res[i].uuid);
                if(uuidArr.indexOf(msg.uuid) !== -1){
                    tempUser = res[i];
                    break;
                }
            }

            player.playerID = tempUser.playerID;
            Color.green("게스트 계정 가입 playerID => ",player.playerID);

            cb(player);

       });
    });
    
}
}

Player.loginPlayer = function(playerID, cb){
    Color.blue("로그인 시도 : ",playerID);

    sql.query("SELECT * FROM player WHERE playerID = ?",[playerID],function(err,res){
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