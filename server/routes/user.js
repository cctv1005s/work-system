var request = require('request');
var config = require('../config');
var tool = require('./tool');
var api = require('../api');
config = tool.formatConfig(config,api);

exports.user = function(req,res,next){
    var query = req.query;
    var UserID = query.UserID;
    request(util.format("%s/%s",config["NickName"],UserID),function(err,data,body){
        res.json(body);
    });
}

exports.userInfo = function(req,res,next){
    var postData = req.body;
    request.post(config["Info"],function(err,req,body){
        res.json(body);
    })
    .form(JSON.stringify(postData));
}