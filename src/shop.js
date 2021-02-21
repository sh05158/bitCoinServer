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

shop.getProductByCode = function(player, msg, cb){
    
}


shop.loadShop = function(player, msg, cb){
    switch(msg.shopType){
        case shopType.CPU:
            this.loadCpuShop(player, msg, cb);
            break;
        case shopType.VGA:
            this.loadVgaShop(player, msg, cb);
            break;
        default:
            cb({
                CODE : CODE.ERROR,
                reason : '존재하지 않는 shopType 값으로 요청했습니다'
            });
            break;
    }
}
shop.loadCpuShop = function(player, msg, cb){
    cb({
        CODE : CODE.OK,
        data : shopData.cpu_shop
    });
}

shop.loadVgaShop = function(player, msg, cb){

}

shop.loadMbShop = function(player, msg, cb){

}

shop.loadRamShop = function(player, msg, cb){

}

shop.loadCoolerShop = function(player, msg, cb){

}

module.exports = shop;