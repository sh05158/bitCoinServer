const { italic } = require('chalk');
const sql = require('../../mysql');
var Player = require('../player');

var getPlayer = function(playerID, cb){
    Player.getPlayer(playerID, function(player){
        console.log("player => ",JSON.stringify(player));
        cb && cb(player);
    });
}

// getPlayer(36);

describe('desc', function(){
    it('TEST1', function(done){
        getPlayer(36, function(player){
            done();
        });
    });
});