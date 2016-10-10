var request = require('request');
var config = require('../config');
var util = require('util');
var config = require('../config');
var tool = require('./tool');
var api = require('../api');
config = tool.formatConfig(config,api);

exports.source = function(req,res,next){        
    var data = req.body;
    var query = util.format("%s?$filter=UserID lt '%s'",config["UWSExploer"],data.UserID);
    request(query,function(err,data,body){
        if(err){
            res.json(err);
            console.log(err);
        }
        else{
            res.json(body);
        }
    });
}

/*文件操作*/
exports.sourceUpdate = function(req,res,next){
    var data = req.body;
    var url = config["SourceCommonUpdate"];
    //直接返回
    request.post(url,function(err,data,body){
        if(err){
           return console.log(err);
        }
        res.json(body);
    })
    .form(JSON.stringify(data));
}


exports.sourceDelete = function(req,res,next){
    var data = req.body;
    var url = config["SourceCommonDelete"];
    //直接返回
    request.post(url,function(err,data,body){
        if(err){
           return console.log(err);
        }
        res.json(body);
    })
    .form(JSON.stringify(data));
}


exports.download = function(req,res,next){
    var data = req.body;
    var url = config["SourceDownload"];
    request.post(url,function(err,data,body){
        if(err){
            return console.log(err);
        }
        res.json(body);
    }).form(JSON.stringify(data));
}