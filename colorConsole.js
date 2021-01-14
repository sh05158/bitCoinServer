const chalk = require('chalk');

var Color = function(){
}

Color.red = function(){
    console.log(chalk.red(...arguments));
}

Color.green = function(){
    console.log(chalk.green(...arguments));
}

Color.blue = function(){
    console.log(chalk.blue(...arguments));
}



module.exports = Color;