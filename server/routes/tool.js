var util = require('util');
exports.formatConfig = function(config,api){
    for(var i in api){
        var typeApi = api[i];
        for(var j in typeApi){
            config[j] = util.format("%s:%s%s",config[i].host,config[i].port,typeApi[j]);
        }
    } 
    return config;
}

