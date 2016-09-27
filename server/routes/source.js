var request = require('request');
var config = require('../config');
var util = require('util');

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
    var url = 'http://58.246.1.146:59800/Uniwork/web/app.php/CommonAction/4B474742-170A-4D37-83F5-8DE94524444A/0/CommonUpdate';
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
    var url = 'http://58.246.1.146:59800/Uniwork/web/app.php/CommonAction/4B474742-170A-4D37-83F5-8DE94524444A/0/CommonDelete';
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
    var url = "http://58.246.1.146:59800/Uniwork/web/app.php/Action/FileSync/Download";
    request.post(url,function(err,data,body){
        if(err){
            return console.log(err);
        }
        res.json(body);
    }).form(JSON.stringify(data));
}