var equipment = require("./equipment");
var util = require('./Util');
var enchantSheet = require('../config/enchant.json');


var EnchantManager = EnchantManager || {};


EnchantManager.enchantItem = function(player, item, cb){
    var targetSheet = null;

    targetSheet = this.getTargetSheet(item.product);

    if(!targetSheet){
        //강화할 수 없는 아이템 
    }
    if(util.getRandomResult(targetSheet.)){
        //강화 성공 
        item.product.enhance++;
    }   
    else {
        //강화 실패
    }
}

EnchantManager.getProb = function(product){
    var targetSheet = null;
    
    switch(product.itemType){
        case equipment.TYPE.CPU:
            targetSheet  = enchantSheet.cpu;
            break;
        case equipment.TYPE.VGA:
            targetSheet  = enchantSheet.vga;
            break;    
        case equipment.TYPE.MB:
            targetSheet  = enchantSheet.mb;
            break;
        case equipment.TYPE.RAM:
            targetSheet  = enchantSheet.ram;
            break;        
        case equipment.TYPE.COOLER:
            targetSheet  = enchantSheet.cooler;
            break;
        default:
            return null;
            
    }

    var targetLevelSheet = null;
    for(var i = 0; i<targetSheet.length;i++){
        if(targetSheet[i].targetLevel === product.itemLevel){
            targetLevelSheet = targetSheet[i];
        }
    }

    return targetLevelSheet;

}

module.exports = EnchantManager;