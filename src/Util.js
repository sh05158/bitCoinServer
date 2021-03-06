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

Util.getQueryString = function(obj){
    var sql1 = "";
    var sql2 = "";
    for(var key in obj){
        sql1 += key.toString()+', ';
        sql2 += "?, ";
    }

    sql1 = sql1.substring(0,sql1.lastIndexOf(', '));
    sql2 = sql2.substring(0,sql2.lastIndexOf(', '));

    return {
        variableStr : sql1,
        questionMarkStr : sql2
    }
}

Util.getQueryArr = function(obj){
    var keyArr = [];
    console.log('getQueryArr ', JSON.stringify(obj));
    for(var key in obj){
        console.log( 'parse Key => ',key, 'obj =>',JSON.stringify(obj[key]) );
        if(Array.isArray(obj[key]) || obj.constructor === Object.constructor){
            keyArr.push(JSON.stringify(obj[key]));
        } 
        else 
        {
            keyArr.push(obj[key]);            
        }

    }

    return keyArr;
}

Util.getUpdateQuery = function(obj){
    var query = '';
    for(var key in obj){
        var temp = '';
        if(obj[key] === null){

            // console.log(key, obj[key], 'null이라 continue');
            continue;
        }
        switch(obj[key].constructor){
            case Number().constructor:
                temp = "'"+obj[key]+"'";
                break;
            case String().constructor:
                temp = "'"+obj[key]+"'";
                break;
            case Object().constructor:
                temp = "'"+JSON.stringify(obj[key])+"'";
                break;
            case Array().constructor:
                temp = "'"+JSON.stringify(obj[key])+"'";
                break;
            default:
                Color.red('알 수 없는 타입입니다 '+obj[key]);
                break;
        }

        query += key + ' = ' + temp +', ';
    }

    query = query.substring(0,query.lastIndexOf(', '));

    return query;
}

Util.IsJsonString = function(str) {
    try {
      var json = JSON.parse(str);
      return (typeof json === 'object');
    } catch (e) {
      return false;
    }
}


Util.getRandomResult = function(prob){
    var a = Math.random();

    return a < prob; //if return true, it's success
}
module.exports = Util;


