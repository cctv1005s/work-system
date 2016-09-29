//全局变量
//暂时用的TokenID
var TokenID = "";
var User = {};

$(function(){
    //初始化其他组件
    InitOtherUI();

    getUser(function(err,data){
        if(err){
            //没有登录就登录
            loginProcess(function(err){
                if(err){
                    wsalert(err);
                }
                else{
                    //上传用户信息
                    postUser();
                    //初始化组件
                    InitUIComponet();
                }
            });
        }
        else{
            User = data;
            TokenID = JSON.parse(User.Content);
            InitUIComponet();
        }
    });
})

//初始化UI组件
var InitUIComponet = function(){
    //系统轮播组件
    var wss = new workSystemSlider('.work-system-slider',{control:['[data-work-slider-0]','[data-work-slider-1]','[data-work-slider-2]']});
    var apm = new appModel('[data-app]');

    var ep = new EventProxy();
    ep.all('allProject','myProject',function(ap,mp){
        ap = mergeProject(ap,mp);
        initProject(ap);
    });

    //所有项目获取
    $.ajax({
        url:'/project',
        type:'post',
        data:{
            TokenID:TokenID
        },
        success:function(data){
            var data = JSON.parse(data);
            var pList = data["value"];
            ep.emit('allProject',pList);
        }
    });

    $.ajax({
        url:'/projectRelate',
        type:'post',
        data:{
            "TokenID": TokenID,
            "UserID": User.userInfo.UserID
        },
        success:function(data){
            var data = JSON.parse(data);            
            var pList = data["value"];
            ep.emit('myProject',pList);
        }
    });

    //资源列表
    var s1 = new sourceList('.source-list-allsource');
    var s2 = new sourceList('.source-list-star',{star:true});
    var s3 = new sourceList('.demand-source-list');
    var s4 = new sourceList('.val-source-list');
    var s5 = new sourceList('.workflow-source-list');
    var s6 = new sourceList('.info-source-list');
    
    //每一个资源列表的更新
    sourceList.updateFn = function(){
        s1.render();
        s2.render();
    }

    //资源项的数据获取
    $.ajax({
        url:'/source',
        type:'post',
        data:{
            "TokenID": TokenID,
            "UserID": User.userInfo.UserID
        },
        success:function(data){
            /*暂时代码*/
            var data = JSON.parse(data);
            var sList = data["value"];
            for(var i = 0;i < sList.length;i++){
                var x = new sourceItem(sList[i]);
                s1.addSource(x);            
                s2.addSource(x);
            }
        }
    });


    //资源项的数据获取
    $.ajax({
        url:'/projectExplorer',
        type:'post',
        data:{
            "UserID": User.userInfo.UserID
        },
        success:function(data){
            /*暂时代码*/
            var data = JSON.parse(data);
            var sList = data["value"];
            for(var s = sList,i = 0;i < s.length;i++){
                switch(s[i].ReqTag){
                    case 0:
                        for(var f = s[i].FileList , j = 0;j < f.length;j++){
                            s3.addSource(new sourceItem(f[j]));
                        }    
                    break;
                    case 5:
                        for(var f = s[i].FileList , j = 0;j < f.length;j++){
                            s4.addSource(new sourceItem(f[j]));
                        }
                    break;
                    case 3:
                        for(var f = s[i].FileList , j = 0;j < f.length;j++){
                            s5.addSource(new sourceItem(f[j]));
                        }
                    break;
                    case 6:
                        for(var f = s[i].FileList , j = 0;j < f.length;j++){
                            console.log(f[j]);
                            s6.addSource(new sourceItem(f[j]));
                        }
                    break;
                }
            }
        }
    });

    //搜索选项
    $('#search-input').on('input',function(e) {
        var search = $(e.currentTarget).val();
        if(search.length == 0)
            return ;
        var sp = new projectList('#search-source-list');
        var pits = p1.findProject(search);
        for(var i = 0;i < pits.length;i++){
            sp.addProject(pits[i]);
        }
    });

    //获取我的个人资料
    getMyProfile();
}


var InitOtherUI = function(){
    //一些没有封装的组件动作
    $('.source-collapse-head').click(function(event){
        $(this).parent().toggleClass('source-collapse-show');
    });

    $('.footer-menu-item').click(function(e){
        $('.footer-menu-item').removeClass('footer-active');
        $(this).addClass('footer-active');
    });

    $('body').on('click', '[data-role-transition]', function(event) {
        event.preventDefault();
        var id = $(this).attr('href');
        var z_index = 1000;
        var $active = $('.data-role-show');
        
        for(var i = 0;i < $active.length;i++){
            var e = $active[i];
            var now_z_index = $(e).css('z-index');
            if(z_index <= now_z_index){
                z_index = 1 + parseInt(now_z_index);
            }
        }
        //获取现在显示的data-role-show里面的最大的z-index，如果z-index是null,那么z-index的值就设为1000
        $(id).css('z-index',z_index);
        $(id).addClass('data-role-show');

    });

    $('body').on('click', '[data-role-back]', function(event) {
        event.preventDefault();
        var id = $(this).attr('href');
        $(id).removeClass('data-role-show');
    });

    $('[data-source-new]').click(function(event) {
        event.preventDefault();
        wsalert('暂时还不能上传文件');
    });

    //下拉菜单的选项
    $('.am-dropdown-content').click(function(event) {
        $('[data-am-dropdown]').click();
    });
}


var loginProcess = function(cb){
    var login =  false;

    if(login)
        cb(null);

    var lprocess = function(){
        var username = $('#user-username').val();
        var password = $('#user-password').val();
        
        if(username.length == 0 || password.length == 0 )
            wsalert('账号或者密码不能为空');
        $.ajax({
            url:'/login',
            type:'post',
            contentType: "application/json; charset=utf-8",   //内容类型
            data:JSON.stringify({
                "UserAccount": username,
                "UserPassword": hex_md5(password).toUpperCase(),
                "ExtraInfo": "Uniwork_Work#20900#00346339000000785176#19999"
            }),
            success:function(data){
                User = JSON.parse(ungzip(data));
                console.log(User);
                if(User.Flag != 100){
                    alert("登录错误");
                    return ;
                }
                User.userInfo = JSON.parse(User.ExtraData);
                TokenID = User.Content.slice(1,User.Content.length-1);
                $('[data-am-modal-close]').click();
                //登录判断，判断是否成功
                wsalert('登录成功');
                $('.app').css('opacity', '1');
                $('#login-back').click();
                cb(null);
            },
            error:function(err){
                cb(err);
            }
        });
    }

    $('#user-login-btn').click(lprocess);
    $('#user-password').keydown(function(e) {
        if(e.keyCode == 13){
            lprocess();
        }
    });
}

var postUser = function(){
    $.ajax({
        url:'/postUser',
        type:'post',
        data:{User:JSON.stringify(User)}
    });
}

var getUser = function(cb){
    $.get('/getUser', function(data) {
         if(data != 'nodata'){
            return cb(null,data);
         }
         cb('没登录呢');
    });
}


var p1 = new projectList('#all-my-project-list');
var p2 = new projectList('#all-my-nopass-project-list');
var p3 = new projectList('#all-my-on-project-list');
var p4 = new projectList('#all-my-completed-project-list');
var p5 = new projectList('#all-my-refund-project-list');

var initMyProject = function(newItem){
    //项目列表
    var e = newItem.option;
    if(!(e.Status >= 0))
        return ;

    $.ajax({
        url:'/projectExplorer',
        type:'Post',
        data:{ReqID:newItem.option.ReqID},
        success:function(data){
        }
    })
    
    p1.addProject(newItem);
    switch(e.ProjectStatus){
        case 0:
         p2.addProject(newItem);
        break;
        case 1:
         p3.addProject(newItem);
        case 2:
         p4.addProject(newItem);
        break;
        case 3:
         p5.addProject(newItem);
        break;                    
    }
} 

var mergeProject = function(p1,p2){
    for(var i = 0;i < p1.length;i++)
        for(var j = 0;j < p2.length;j++){
            if(p1[i].id == p2[j].UWSProjectID){
                //如果两个项目是同一个项目
               p1[i] = $.extend({},p2[j],p1[i]);
            }
        }
    return p1;
}

var initProject = function(ap){
   var allp = new projectList('#all-project-list');
   var apl = [];
   for(var i = 0;i < ap.length;i++){
        apl.push(new projectItem(ap[i]));
   }

   for(var i = 0;i < apl.length;i++){
        allp.addProject(apl[i]);
        initMyProject(apl[i]);
   }
}

var getMyProfile = function(){
    var upData = {TokenID:TokenID};
    $.ajax({
        url:'userInfo',
        type:'Post',
        contentType: "application/json; charset=utf-8",   //内容类型
        data:JSON.stringify(upData),
        success:function(data){
            var postData = ungzip(data),
                content = JSON.parse(postData).Content;
                content = JSON.parse(content);
            console.log(content);
            var profile = {
                Score:content.Skill.Score,
                UserID:content.UserID,
                MainImage:content.PhotoName,
                SkillList:content.Skill.SkillList,
                Attendance:content.Skill.Attendance,
                Stability:content.Stability,
                NickName:content.NickName
            };
            var $container = $('#my-profile');
            var pp = new projectProfile(profile);
            $container.html(pp.render());
            pp.getUserHead(function(err,url){
                if(err){wsalert(err);}
                $container.find('[data-profile-img]').attr('src',url);
            })
        }
    });
}
