const { italic } = require('chalk');
const sql = require('../../mysql');
var Player = require('../player');
var EnchantManager = require('../enchant');

var getPlayer = function(playerID, cb){
    Player.getPlayer(playerID, function(player){
        // console.log("player => ",JSON.stringify(player));
        cb && cb(player);
    });
}

// getPlayer(36);

describe('강화 테스트 ', function(){
    it('인벤토리 첫번째 아이템 강화 시도', function(done){
        getPlayer(36, function(player){
            console.log(player.inventory[0].item);
            EnchantManager.enchantItem(player, player.inventory[0].item, function(res){
                console.log(res,player.inventory[0].item);
                done();
            });
        });
    });
});