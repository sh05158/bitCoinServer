var shopData = require('../config/shop.json');
const CODE = require('./code');

var shopType = {
    CPU     : 0,
    VGA     : 1,
    MB      : 2,
    RAM     : 3,
    COOLER  : 4
}

var shop = shop || {};

shop.buyItem = function(player, msg, cb){

}

shop.getProductByCode = function(player, msg, cb){ //shopType, code 필요 
    var productList = this.loadShop(player, msg, cb);

    var items = productList.items;

    var targetItem = null;
    for(var i = 0; i<items.length; i++){
        if(items[i].item.product.code === msg.code){
            targetItem = items[i];
            break;
        }
    }

    return targetItem;
}

shop.getShop = function(player, msg, cb){
    cb({
        data : this.loadShop(player, msg, cb),
        CODE : CODE.OK
    });
}

shop.loadShop = function(player, msg, cb){
    switch(msg.shopType){
        case shopType.CPU:
            return this.loadCpuShop;
            break;
        case shopType.VGA:
            return this.loadVgaShop;
            break;
        case shopType.MB:
            return this.loadMbShop;
            break;
        case shopType.RAM:
            return this.loadRamShop;
            break;
        case shopType.COOLER:
            return this.loadCoolerShop;
            break;
        default:
            return null;
            break;
    }
}
shop.loadCpuShop = function(){
    return shopData.cpu_shop;
}

shop.loadVgaShop = function(player, msg, cb){
    return shopData.vga_shop;

}

shop.loadMbShop = function(player, msg, cb){
    return shopData.mb_shop;

}

shop.loadRamShop = function(player, msg, cb){
    return shopData.ram_shop;
    
}

shop.loadCoolerShop = function(player, msg, cb){
    return shopData.cooler_shop;

}

module.exports = shop;