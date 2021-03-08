var equipment = require('./equipment');

var score = score || {};

score.getScoreSum = function(player){

    var scoreSum = 0;

    scoreSum += this.getCpuScore(player);
    scoreSum += this.getVgaScore(player);
    scoreSum += this.getRamScore(player);

    return scoreSum+100;

}


score.getCpuScore = function(player){
    var cpu = equipment.getPlayerCPU(player);

    if(cpu === null || cpu === {} || !cpu){
        return 0;
    }

    return this.getItemScore(cpu);
}

score.getVgaScore = function(player){
    var vga = equipment.getPlayerVGA(player);

    if(vga === null || vga === {} || !vga){
        return 0;
    }

    var currScore = vga.clock * vga.core * vga.baseSpeed;

    return this.getItemScore(vga);

}

score.getRamScore = function(player){
    var ramArray = equipment.getPlayerRAM(player);

    if(ramArray === null || ramArray === [] || !ramArray){
        return 0;
    }

    var ramScore = 0;

    for(var i = 0; i<ramArray.length; i++){
        var ram = ramArray[i];
        if(ram === null || ram === [] || !ram){
            continue;
        }
        ramScore += this.getItemScore(ram);

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

score.getItemScore = function(item){
    if(!item || item.itemType === null){
        return -1;
    }

    switch(item.itemType){
        case equipment.TYPE.CPU:
            return item.clock * item.core * item.baseSpeed;
            break;
        case equipment.TYPE.VGA:
            return item.clock * item.core * item.baseSpeed;
            break;           
        case equipment.TYPE.RAM:
            return item.clock * item.capacity / 100;
            break; 
        default:
            return -1;
            break;
    }
}
module.exports = score;