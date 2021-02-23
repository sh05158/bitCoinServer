var equipment = equipment || {};

equipment.TYPE = {
    CPU     : 0,
    VGA     : 1,
    MB      : 2,
    RAM     : 3,
    COOLER  : 4
}

equipment.getPlayerEquipment = function(player, msg){
    switch(msg.equipType){
        case equipment.TYPE.CPU:
            return this.getPlayerCPU();
            break;

        case equipment.TYPE.VGA:
            return this.getPlayerVGA();
            break;

        case equipment.TYPE.MB:
            return this.getPlayerMB();
            break;

        case equipment.TYPE.RAM:
            return this.getPlayerRAM(msg.ramIndex);
            break;

        case equipment.TYPE.COOLER:
            return this.getPlayerCOOLER();
            break;

        default:
            break;
    }
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