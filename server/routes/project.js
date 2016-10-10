var request = require('request');
var api = require('../api');
var util = require('util');

var config = require('../config');
var tool = require('./tool');

config = tool.formatConfig(config,api);


exports.project = function(req,res,next){
    var postData = req.body;
    var query = util.format("%s",config["UWSProject"]);
    request(query,function(err,data,body){
        res.json(body);
    });
}


exports.projectRelate = function(req,res,next){
    var postData = req.body;
    var UserID = postData.UserID;

    var query = util.format("%s?$filter=UserID eq \'%s\'",config["UWSProjectRelate"],UserID);
    console.log(query);
    request(query,function(err,data,body){
        res.json(body);
    });
}


exports.projectExplorer = function(req,res,next){
    var postData = req.body;
    var ReqID = postData.UserID;
    var query = util.format('%s?$filter=UserID eq \'%s\'',config['UWSProjectExplorer'],ReqID);
    request(query,function(err,data,body){
        res.json(body);
    });
}

exports.projectApply = function(req,res,next){
    var postData = req.body;
    var query = config["ProjectCommonAdd"];
    request.post(query,function(err,req,body){
        if(err){console.log(err);}
        res.json(body);
    })
    .form(JSON.stringify(postData));
}

exports.projectPick = function(req,res,next){
    var postData = req.body;
    var query = config["ProjectCommonUpdate"];
    request.post(query,function(err,req,body){
        res.json(body);
    })
    .form(JSON.stringify(postData));
}