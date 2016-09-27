var request = require('request');

exports.postLogin = function(req,res,next){
    /*给每一个用户分配一个自己的jar*/
    try{
    var data = req.body;
    request.post('http://58.246.1.146:59800/Uniwork/web/app.php/Action/Account/Authen',function(err,data,body){
        if(err){
            console.log(err);
        }
        else{
            res.json(body);
        }  
    })
    .form(JSON.stringify(data));
    }
    catch(e){
        console.log(e);
    }
}

/*上传User信息，保存到session中*/
exports.postUser = function(req,res,next){
    var postData = req.body;
    try{
    req.session.user = JSON.parse(postData.User);
    res.json({});
    }
    catch(e){
        console.log(e);
    }

}

exports.getUser = function(req,res,next){
    if(req.session.user)
    return res.json(req.session.user);
    
    res.json('nodata');
}

exports.logout = function(req,res,next){
    req.session.user = null;
    res.redirect('/');
}