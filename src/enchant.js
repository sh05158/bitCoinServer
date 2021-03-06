var equipment = require("./equipment");
var util = require('./Util');
var enchantSheet = require('../config/enchant.json');


var EnchantManager = EnchantManager || {};


EnchantManager.enchantItem = function(player, item, cb){
    var prob = null;

    switch(item.itemType){
        case equipment.TYPE.CPU:
            prob = this.getCpuProb;
            break;
    }
}

EnchantManager.getCpuProb = function(item){
    var targetSheet = enchantSheet.cpu;


    var targetLevelSheet = null;
    for(var i = 0; i<targetSheet.length;i++){
        if(targetSheet[i].targetLevel === item.itemLevel){
            targetLevelSheet = targetSheet[i];
        }
    }

    if(!targetLevelSheet){
        return null;
    }

    return !!targetLevelSheet[item.enhance] ? targetLevelSheet[item.enhance] : null;

}

module.exports = EnchantManager;