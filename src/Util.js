const Color = require("../colorConsole");

var Util = Util || {}; //

Util.isEmptyArray = function(arr){
    return Array.isArray(arr) && arr.length === 0;
}

Util.getAvailableNumber = function(array,min){
    if(!min){
        min = 0;
    }
    if(!Array.isArray(array)){
        Color.red("is Not Array !!! return null");
        return null;

    }
    if(this.isEmptyArray(array)){
        return 0;
    }
    arr = [...array].sort();

    var returnVal = 999999999999999;
    for(var i = 0; i<arr.length-1;i++){ //ex) 0,1,2,3,4
        if(arr[i+1] > arr[i]+1){
            returnVal = arr[i]+1;
            break;
        }
    }
    returnVal = Math.min(returnVal, arr[arr.length-1]+1);

    if(arr[0] > min){
        returnVal = min;
    }

    return returnVal;
}

module.exports = Util;


