var request = require('request');

exports.user = function(req,res,next){
    var query = req.query;
    var UserID = query.UserID;
    request('http://58.246.1.146:59800/Uniwork/web/app.php/Action/Account/NickName/'+UserID,function(err,data,body){
        res.json(body);
    });
}

exports.userInfo = function(req,res,next){
    var postData = req.body;
    request.post("http://58.246.1.146:59800/Uniwork/web/app.php/Action/Account/Info",function(err,req,body){
        res.json(body);
    })
    .form(JSON.stringify(postData));
}