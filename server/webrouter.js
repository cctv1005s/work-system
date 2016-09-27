var express = require('express');
var router = express.Router();
var route = require('./routes'),
    auth = route.auth,
    source = route.source,
    project = route.project;
    user = route.user;
var userRequired = function(req,res,next){
    if(!req.session.user)
        res.json('请先登录');
    next();
}


/* GET home page. */
router.get('/', function(req, res, next){
    //登录权限控制
    var login = false;
    if(req.session.user){
        login = true;
    }    

    res.render('index',{login:login});
});


router.post('/login',auth.postLogin);/*登录*/
router.get('/logout',auth.logout);
router.post('/postUser',auth.postUser);/*保存session*/
router.get('/getUser',auth.getUser);

/*source*/
router.post('/source',source.source);
router.post('/sourceUpdate',source.sourceUpdate);/*文件修改*/
router.post('/sourceDelete',source.sourceDelete);/*文件删除*/

/*project*/
router.post('/project',project.project);
router.post('/projectRelate',project.projectRelate);
router.post('/projectExplorer',project.projectExplorer);
router.post('/projectApply',project.projectApply);
router.post('/projectPick',project.projectPick);

/*download*/
router.post('/download',source.download);

/*user*/
router.get('/user',user.user);
router.post('/userInfo',user.userInfo);

module.exports = router;
