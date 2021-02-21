var inventory = inventory || {};

inventory.getInventory = function(player, msg, cb){
    var targetItem = player.inventory[msg.idx];
    return targetItem;
}

inventory.getItem = function(player, item, cb){
    var loc_inventory = player.inventory;
    var idx = this.findBlankInventory(player);
    if(idx===-1){
        player.inventory.push(item);
    }
    else{
        player.inventory[idx] = item;
    }
}

inventory.deleteItem = function(player, idx, cb){
    player.inventory[idx] = {};
}

inventory.findBlankInventory = function(player){
    for(var i = 0; i<player.inventory.length;i++){
        if(player.inventory[i] === {}|| player.inventory[i] === null){
            return i;
        }
    }
    return -1;
}

inventory.swap = function(player, i, j){
    var temp = player.inventory[i];
    player.inventory[i] = player.inventory[j];
    player.inventory[j] = temp;
}


module.exports = inventory;