var equipment = equipment || {};

equipment.TYPE = {
    CPU     : 0,
    VGA     : 1,
    MB      : 2,
    RAM     : 3,
    COOLER  : 4
}

equipment.getPlayerCPU = function(player){
    return player.equipment.cpu;
}


equipment.getPlayerVGA = function(player){
    return player.equipment.vga;
}


equipment.getPlayerMB = function(player){
    return player.equipment.mb;
}


equipment.getPlayerRAM = function(player){
    return player.equipment.ram;
}


equipment.getPlayerCOOLER = function(player){
    return player.equipment.cooler;
}



// equipment.prototype.

module.exports = equipment;