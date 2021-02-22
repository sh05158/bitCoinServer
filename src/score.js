var equipment = require('./equipment');

var score = score || {};

score.getScoreSum = function(player){

    var scoreSum = 0;

    scoreSum += this.getCpuScore(player);
    scoreSum += this.getVgaScore(player);
    scoreSum += this.getRamScore(player);

    return scoreSum+1;

}


score.getCpuScore = function(player){
    var cpu = equipment.getPlayerCPU(player);

    if(cpu === null || cpu === {}){
        return 0;
    }

    var currScore = cpu.clock * cpu.core * cpu.baseSpeed;

    return currScore;
}

score.getVgaScore = function(player){
    var vga = equipment.getPlayerVGA(player);

    if(vga === null || vga === {}){
        return 0;
    }

    var currScore = vga.clock * vga.core * vga.baseSpeed;

    return currScore;
}

score.getRamScore = function(player){
    var ramArray = equipment.getPlayerRAM(player);

    if(ramArray === null || ramArray === []){
        return 0;
    }

    var ramScore = 0;

    for(var i = 0; i<ramArray.length; i++){
        var ram = ramArray[i];
        if(ram === null || ram === []){
            continue;
        }
        ramScore += ram.clock * ram.capacity / 100;

    }

    return ramScore;
}

score.getMiningCoin = function(player){
    var timeDiff = new Date().getTime() - player.lastRequestTime;

    var mineCount = timeDiff/player.mineTime;

    if(mineCount < 1){
        return 0;
    }

    var mineCoin = mineCount * player.scoreSum / 500000;

    return mineCoin;
}
module.exports = score;