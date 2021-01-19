const mysql = require("mysql2");
const Color = require('./colorConsole');
const config = require('./mysqlConfig.json');

const connection = mysql.createConnection({
    // host            :   config.host,
    user            :   config.user,
    database        :   config.database,
    port            :   config.port,
    connectionLimit :   config.connectionLimit,
    password        :   config.password
});

connection.connect(function(err){
    if(!err){
        Color.green("mysql Connection Complete");
    } else {
        Color.red("Cannot connect to mysql",err);
    }
});

var sql = sql || {};

sql.query = function(query, args, cb){
    connection.query(query, args, function(err,res,fields){
        if(err){
            Color.red("쿼리 처리 중 에러 발생", err,query,args);
        }
        cb(err,res);
    });
}


module.exports = sql;