var request = require('request');
var config = require('../config');
var util = require('util');


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
    var query = "http://site/Uniwork/web/app.php/CommonAction/651C3B7D-518E-5964-B1A0-0DED3353C2B6/1/CommonAdd";
    request.post(query,function(err,req,body){
        res.json(body);
    })
    .form(JSON.stringify(postData));
}

exports.projectPick = function(req,res,next){
    var postData = req.body;
    var query = "http://58.246.1.146:59800/Uniwork/web/app.php/CommonAction/651C3B7D-518E-5964-B1A0-0DED3353C2B6/0/CommonUpdate";
    console.log(postData);
    request.post(query,function(err,req,body){
        res.json(body);
    })
    .form(JSON.stringify(postData));
}