// const { createConnection } = require('mysql2/typings/mysql');
var shopData = require('../config/shop.json');
const CODE = require('./code'),
    inventory = require('./inventory'),
    score = require('./score');

var Player = require('./player');

// Player.updatePlayer(22,null);


var shopType = {
    CPU     : 0,
    VGA     : 1,
    MB      : 2,
    RAM     : 3,
    COOLER  : 4
}

var shop = shop || {};

shop.buyType = {
    GOLD        : 0,
    DIAMOND     : 1,
}
shop.buyItem = function(player, msg, cb){
    var targetProduct = shop.getProductByCode( player, msg ); //아이템 코드로 product 가져오기 

    if(!targetProduct || targetProduct === {}){
        cb({
            CODE : CODE.ERROR,
            reason : '존재하지 않는 상품입니다'
        });
        return;
    }

    switch(msg.buyType){
        case shop.buyType.GOLD:


            if(!targetProduct.item.price.gold){
                cb({
                    CODE:CODE.ERROR,
                    reason:'골드로 구입할 수 없는 아이템입니다'
                });
                return;
            }


            if(player.gold >= targetProduct.item.price.gold){
                player.gold -= targetProduct.item.price.gold;
                inventory.getItem(player, targetProduct);

                console.log("buy ITEM RETURN MSG => ",JSON.stringify(player));

                cb({
                    CODE        : CODE.OK,
                    targetItem  : targetProduct,
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
        case shop.buyType.DIAMOND:

            if(!targetProduct.item.price.diamond){
                cb({
                    CODE:CODE.ERROR,
                    reason:'다이아로 구입할 수 없는 아이템입니다'
                });
                return;
            }

            if(player.diamond >= targetProduct.item.price.diamond){
                player.diamond -= targetProduct.item.price.diamond;
                inventory.getItem(player, targetProduct);
                cb({
                    CODE        :   CODE.OK,
                    targetItem  :   targetProduct,
                    player      :   player
                });
            }
            else{
                cb({
                    CODE        : CODE.ERROR,
                    reason      : '다이아가 부족합니다'
                });
            }
            break;
    }




}


shop.getProductByCode = function(player, msg){ //shopType, code 필요 

    console.log("msg => ",JSON.stringify(msg));

    var shopList = shopData;
    var targetItem = null;

    for(var shopType in shopList){
        console.log(shopType,"////",JSON.stringify(shopType),"@@@@",JSON.stringify(shopList[shopType]));
        var items = shopList[shopType].items;

        for(var i = 0; i<items.length; i++){
            console.log("curr item => ",JSON.stringify(items[i].item.product.code));
            if(items[i].item.product.code === msg.code){
                targetItem = items[i];
                return targetItem;
            }
        }
    }
    
    

    return null;
}

shop.getShop = function(player, msg, cb){
    var shopData = JSON.parse(JSON.stringify(shop.loadShop(player,msg))).items;

    if(!!shopData && Array.isArray(shopData)){
        for(var i = 0; i<shopData.length;i++){
            var itemScore = score.getItemScore(shopData[i].item.product);
            shopData[i].item.product.score = itemScore;
        }
    }

    // console.log(JSON.stringify(shopData));

    !!cb && cb({
        data : shopData,
        CODE : CODE.OK
    });
}


shop.loadShop = function(player, msg){
    switch(msg.shopType){
        case shopType.CPU:
            return this.loadCpuShop();
            break;
        case shopType.VGA:
            return this.loadVgaShop();
            break;
        case shopType.MB:
            return this.loadMbShop();
            break;
        case shopType.RAM:
            return this.loadRamShop();
            break;
        case shopType.COOLER:
            return this.loadCoolerShop();
            break;
        default:
            return null;
            break;
    }
}
shop.loadCpuShop = function(){
    return shopData.cpu_shop;
}

shop.loadVgaShop = function(){
    return shopData.vga_shop;

}

shop.loadMbShop = function(){
    return shopData.mb_shop;

}

shop.loadRamShop = function(){
    return shopData.ram_shop;
    
}

shop.loadCoolerShop = function(){
    return shopData.cooler_shop;

}

module.exports = shop;

// shop.getShop(null, {shopType:0}, null);

// shop.buyItem({playerID:1},{code:101},null);
