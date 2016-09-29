;(function($){
	var _add = function(WSS,fn){
		fn();
	};

	var WSS = function(node,option){
		this.$container = $(node);
		this.option = option;
		this.init();
	};

	/*sourceItem*/
	var SI = function(option){
		this.option = option;
		this.init();
	}

	/*sourceList*/
	var SL = function(node,option){
		this.$container = $(node);
		this.option = option;
		this.init();
	}

	var PI = function(option){
		this.option = option;
		this.init();
	}

	var PL = function(node){
		this.$container = $(node);
		this.init();
	}

	var PE = function(node,pi){
		this.$container = $(node);
		this.pi = pi;
		this.init();
	}

	var PP = function(option){
		this.option = option;
		this.init();
	}

	var PPP = function(node,option){
		this.$container = $(node);
		this.option = option;
		this.init();
	};

	var APM = function(node,option){
		this.$container = $(node);
		this.option = option;
		this.init();
	}

	var SC = function(node,option){
		this.$container = $(node);
		this.option = option;
		this.init();
	}

	/*work-system-slider*/
	WSS.fn = WSS.prototype;
	SI.fn = SI.prototype;
	SL.fn = SL.prototype;
	PL.fn = PL.prototype;
	PI.fn = PI.prototype;
	PE.fn = PE.prototype;
	PP.fn = PP.prototype;
	PPP.fn = PPP.prototype;
	SC.fn = SC.prototype;
	APM.fn = APM.prototype;

	window.workSystemSlider = WSS;
	window.sourceItem = SI;
	window.sourceList = SL;
	window.projectList = PL;
	window.projectItem = PI;
	window.projectEntrust = PE;
	window.projectProfile = PP;
	window.sourceCollapse = SC;
	window.appModel = APM;

	//对验证码的验证
	var flagProcess = function(data){
	    switch(data.Flag){
	        case -100:
	            wsalert('验证错误')
	            return false; 
	        default:
	        	return true;
	    }
	}

	var getThumbUrl = function(FileGUID,cb){
		if(FileGUID.length == 0)
			return cb(null,null);
		
		var pos = FileGUID.indexOf('.');
		var type = FileGUID.substr(pos+1,FileGUID.length);
		if(type!='png'&&type!='bmp'&&type!='ico'&&type!='gif'&&type!='jpg'&&type!='jpeg')
			return ;
		var GUID = FileGUID.substr(0,pos);
		var thumbUrl = GUID+'.thumbnail_400w'+FileGUID.substr(pos,FileGUID.length);
		$.ajax({
			url:'/download',
			type:'post',
			data:{
				TokenID:TokenID,
				ServerPath:thumbUrl
			},
			success:function(data){
				try{
				var backInfo = JSON.parse(ungzip(data));
				var fileInfo = JSON.parse(backInfo.Content);
				var StoreFilePath = fileInfo.StoreFilePath;
				}
				catch(e){
					console.log(e);
				}
				thumbUrl = "http://58.246.1.146:59804/uploads/"+Base64.encode(StoreFilePath);
				cb(null,thumbUrl);
			},
			err:function(err){
				cb(err);
			}
		});		
	}

	var getUserByUserID = function(UserID,cb){		
		$.ajax({
			url:'/user?UserID='+UserID,
			type:'get',
			success:function(data){		
				var backInfo = JSON.parse(ungzip(data));				
				cb(null,backInfo);
			},
			err:function(err){
				cb(err);
			}
		});	
	}

	var getMyProject = function(UserID,cb){
	    $.ajax({
	        url:'/projectRelate',
	        type:'post',
	        data:{
	            "TokenID": TokenID,
	            "UserID": UserID
	        },
	        success:function(data){
	            var data = JSON.parse(data);            
	            var pList = data["value"];
	            cb(null,pList);
	        },
	        err:function(err){
	        	cb(err);
	        }
	    });
	};

_add(WSS,function(){	
	WSS.fn.init = function(){
		//初始化轮播大小
		var width = window.innerWidth;;
		this.width = width;
		
		var $lis = this.$container.find('.work-slider-item');
		$lis.css('width',width);
		this.$lis = $lis;

		var $ul = this.$container.find('.work-slider-list');
		this.$ul = $ul;
		this.position = 0;
		this.eventBind();
	}

	WSS.fn.eventBind = function(){
		var control = this.option.control;
		var self = this;

		$.each(control,function(i,e){
			$(e).click(function(){
				self.position = i;
				self.render();
			})
		})
	}

	WSS.fn.render = function(){
		var move =-(this.position * this.width);
		this.$ul.css('transform','translateX('+move+'px)');
	}

});

_add(SI,function(){
	SI.fn.init = function(){
		/*数据获得*/
		this.option.UWSExplorerID = this.option.id;
	}
	
	SI.fn.iconProcess = function(cb){
		var option = this.option;
		var type = this.option.FileSpecies;
		if(type!='png'&&type!='bmp'&&type!='ico'&&type!='gif'&&type!='jpg'&&type!='jpeg')
			return ;
		var FileGUID = option.FileGUID;
		getThumbUrl(FileGUID,function(err,url){
			option.img = url;
			cb();
		});
	}

	SI.fn.render = function(){
		var option = this.option;
		if(!option){
			return "";
		}
		var size = option.FileSize||option.Size,
			img = option.img||'./img/source_img.gif',
			name = option.FileName||option.Title,
			type = option.FileSpecies||"unknow",
			date1 = option.FileCreateTime||option.CreateTime,
			date2 = option.FileUpdateTime||option.UpdateTime,
			syn = option.syn||'同步',
			star= option.IsStar == 1?'source-item-star':'',
			mark = option.IsStar==1?'取消标记':'标记',
			id = option.UWSExplorerID,
			className = option.className||"";

		var html = 
                    '<div class="source-item clearfix '+className+''+star+'" data-source-id-'+id+'>'+
                      '<div class="source-item-body clearfix left">'+
                        '<div class="source-img am-u-sm-2">'+
                          '<img src="'+img+'">'+
                        '</div>'+
                         '<div class="source-info am-u-sm-10">'+
                                '<div class="source-info-l left">'+
                                    '<div class="source-name"><span>'+name+'</span><i class="am-icon-star source-star">'+'</i>'+'</div>'+
                                    '<div class="source-filetype">'+type+'</div>'+
                                    '<div class="source-size">'+size+'</div>'+
                                '</div>'+
                                '<div class="source-info-r right">'+
                                    '<div class="source-date">'+date1+'</div>'+
                                     '<div class="source-date">'+date2+'</div>'+
                                     '<div class="source-syn right greyword">'+syn+'</div>'+
                                '</div>'+
                         '</div>'+
                       '</div>'+
                       '<div class="source-item-menu left">'+
                         '<div class="source-mark left">'+mark+'</div>'+
                         '<div class="source-share left">'+'分享'+'</div>'+
                         '<div class="source-rename left">'+'重命名'+'</div>'+
                         '<div class="source-delete left">'+'删除'+'</div>'+
                       '</div>'+
                    '</div>';
		return  html;
	}

});

_add(SL,function(){
	SL.fn.init = function(){
		this.sourceList = [];
		//也就是说，最多只会10000个列表
		this.id = parseInt(Math.random()*10000);
		this.render();
		setInterval(function(){
			$('.source-item-body').width($('body').width());

			$('.source-item-body').on('swipeleft',function(){    
			    $(this).parent().addClass('source-item-open');
			});
			$('.source-item-body').on('swiperight',function(){    
			    $(this).parent().removeClass('source-item-open');
			});
		},1000);
	};

	SL.fn.eventBind = function(){
		/*对每一个sourseItem*/
		var sourceList = this.sourceList;
		var $container = this.$container;
		var ListId = this.id;
		var self = this;

		$('[data-source-new]').click(function(event) {
			event.preventDefault();
			wsalert('暂时还不能上传文件');
		});

		$.each(sourceList,function(i, e) {
			if(!e[ListId]){
				e[ListId]={}
			}
			if(e[ListId].bind){
				return ;
			}
			var id = e.option.UWSExplorerID;
			e[ListId].bind = true;

			/*对标星和取消标星事件响应*/
			$container.on('click','[data-source-id-'+id+'] .source-mark',function(event) {
				/*提交到服务器*/
				e.option.IsStar = !e.option.IsStar;
				self.sourceMark(id,e.option.IsStar);
				self.render();
			});

			$container.on('click','[data-source-id-'+id+'] .source-share',function(event){
				/*提交到服务器*/

			});


			$container.on('click','[data-source-id-'+id+'] .source-rename',function(event){
				/*提交到服务器*/
				$('#ws-prompt')
				.attr('data-source-id',id)
				.modal({
			      relatedTarget: this,
			      onConfirm: function(e) {
			      	var id = $('#ws-prompt').attr('data-source-id');
			      	self.sourceRename(id,e.data);
			      },
			      onCancel: function(e) {
			      }
			    });
			});

			$container.on('click','[data-source-id-'+id+'] .source-delete',function(event){
				$('#source-delete-confirm').modal({
					relatedTarget: this,
					onConfirm: function(options){
						self.sourceDelete(id);
					},
					// closeOnConfirm: false,
					onCancel: function() {
					}
				});
			});

			e.iconProcess(function(){
				self.render();
			})
		});

	}

	SL.fn.addSource = function(s){
		var self = this;
		getThumbUrl(s.option.GUIDName,function(err,url){
			s.option.img = url;
			self.sourceList.push(s);
			self.$container.append(s.render());
			self.eventBind();
		});		
	}

	SL.fn.sourceMark = function(id,mark){
		var self = this;

		var postdata = {
				"TokenID": TokenID,
				"UWSExplorerID": id,
				"IsStar": mark?1:0
		};

		$.ajax({
			url:'/sourceUpdate',
			type:'post',
			contentType: "application/json; charset=utf-8",   //内容类型
			data:JSON.stringify(postdata),
			success:function(data){
				var backInfo = JSON.parse(ungzip(data));
				flagProcess(backInfo);
				var content = JSON.parse(backInfo.Content);
				var itemContent = content.ItemContent;
				var newItem = JSON.parse(itemContent)
				self.getSourceById(id).option = newItem; 
				wsalert('操作成功');
			},
			error:function(err){
			}
		});
	}

	SL.fn.sourceRename = function(id,name){
		var self = this;
		var postdata = {
				"TokenID": TokenID,
				"UWSExplorerID": id,
				"FileName":name
		};

		$.ajax({
			url:'/sourceUpdate',
			type:'post',
			contentType: "application/json; charset=utf-8",   //内容类型
			data:JSON.stringify(postdata),
			success:function(data){
				var backInfo = JSON.parse(ungzip(data));
				flagProcess(backInfo);
				var content = JSON.parse(backInfo.Content);
				var itemContent = content.ItemContent;
				var newItem = JSON.parse(itemContent)
				self.getSourceById(id).option = newItem; 
				wsalert('重命名成功');
				self.render();
			},
			error:function(err){
				
			}
		});
	};

	SL.fn.sourceDelete = function(id){
		var self = this;
		var postdata = {
				"TokenID": TokenID,
				"CommonItemID":id
		};
		$.ajax({
			url:'/sourceDelete',
			type:'post',
			contentType: "application/json; charset=utf-8",   //内容类型
			data:JSON.stringify(postdata),
			success:function(data){
				var backInfo = JSON.parse(ungzip(data));
				flagProcess(backInfo);
				self.getSourceById(id).option = null;
				self.render();
			},
			error:function(err){
			}
		});
	}

	SL.fn.getSourceById = function(id){
		var sourceList = this.sourceList;
		for(var i = 0;i < sourceList.length;i++){
			if(sourceList[i].option.UWSExplorerID == id)
				return sourceList[i];
		}
	}

	SL.fn.deleteSourceById = function(id){
		var sourceList = this.sourceList;
		for(var i = 0;i < sourceList.length;i++){
			if(sourceList[i].option.UWSExplorerID == id)
				sourceList.slice(i,i+1);
		}	
	}
 
	SL.fn.render = function(){
		var sourceList = this.sourceList;
		var $container = this.$container;
		var html = "";

		//一些标星判断
		if(this.option)
		var star = this.option.star||false;

		for(var i = 0;i < sourceList.length;i++){
			if(star){
				if(sourceList[i].option.IsStar == 0)
					continue;
			}
			html += sourceList[i].render();
		}
		$container.html(html);
		SL.updateAll();
	}

	SL.updateAll = function(){
		if(SL.updateFlag)
			return ;
		SL.updateFlag = true;
		SL.updateFn();
		SL.updateFlag = false;
	}

	SL.updateFn = function(){

	}

});

_add(PI,function(){
	PI.fn.init = function(){
	};

	PI.fn.iconProcess = function(cb){
		var option = this.option;
		var FileGUID = option.ProjectIcon;
		if(FileGUID.length == 0)
			return ;
		getThumbUrl(FileGUID,function(err,url){
			option.ProjectIcon = url;
			cb()
		});
	}

	PI.fn.fileProcess = function(cb){
		var option = this.option;
		var FileList = option.ImgList;
		$.each(FileList,function(i,e) {
			var FileGUID = e.GUIDName;
			getThumbUrl(FileGUID,function(err,url){
				e.icon = url;
			});
		});
	}

	PI.fn.render = function(){
		var option = this.option;
		var icon = option.ProjectIcon||"./img/project_1.gif",
			title = option.Title,
			type = option.Type,
			ReleaseTime = option.ReleaseTime,
			id = option.id,
			num = option.CountOfPerson,
			EmployeeAward = option.PriceList.SupplierAward;

		var html = '<div class="project-item" data-project-id-'+id+'>'+
                        '<a href="#project-entrust" data-role-transition >'+
                            '<div class="project-item-img am-u-sm-2">'+
                                '<img src="'+icon+'" alt="">'+
                            '</div>'+
                            '<div class="project-item-info am-u-sm-10">'+
                                '<div class="project-binfo left">'+ 
                                    '<div class="project-name">'+ title +'</div>'+
                                    '<div class="project-work">'+ type +'</div>'+
                                    '<div class="project-num">'+ num+'人</div>'+
                                '</div>'+
                                '<div class="project-ainfo right">'+
                                    '<div class="project-date">'+ ReleaseTime +'</div>'+
                                    '<div class="project-budget">'+'<span class="am-badge am-round">'+ '￥'+EmployeeAward+'</span>'+'</div>'+
                                '</div>'+
                            '</div>'+
                        '</a>'+
                    '</div>';

        return html;
	}
}); 

_add(PL,function(){
	PL.fn.init = function(){
		this.projectList = [];
		this.eventBind();
		this.render();
		this.PLID = new Date().getTime();
	};

	PL.fn.eventBind = function(){
		var $container = this.$container;
		var projectList = this.projectList;
		var PLID = this.PLID;
		var self = this;
		$.each(projectList,function(i,e) {
			//绑定检测
			if(!e[PLID]){
				e[PLID] = {};
			}
			if(e[PLID].bind)
				return ;
			e[PLID].bind = true;
					
			var id = e.option.id;
			$container.on('click','[data-project-id-'+id+']', function(event) {
				//对跳转的界面进行修改
				new projectEntrust('#project-entrust',e);
				new PPP('#project-pick',e); 
			});
			//自己的文件处理		
			e.fileProcess();	
			e.iconProcess(function(){
				self.render();
			})
		});
		
	};

	PL.fn.render = function(){
		var html = "";
		var $container = this.$container;
		var projectList = this.projectList;
		for(var i = 0;i < projectList.length;i++)
			html += this.projectList[i].render();
		$container.html(html);
	};

	/*添加之后重新绑定时间*/
	PL.fn.addProject = function(elem){
		this.projectList.push(elem);
		this.eventBind();
		this.$container.append(elem.render());
	};

	PL.fn.findProject = function(findTitle){
		var projectList = this.projectList;
		var rproject = [];
		for(var i = 0;i < projectList.length;i++){
			var option = projectList[i].option;
			var title = option.Title;
			if(title.match(findTitle)){
				rproject.push(projectList[i]);
			}
		}
		return rproject;
	}

	/*多个PL重新渲染*/
	PL.updateAll = function(){
		if(PL.updateFlag)
		return ; 
		PL.updateFlag = true;
		PL.updateFn();
		PL.updateFlag = false;
	}

	PL.updateFn = function(){

	}

	/*return this.projectList*/
	PL.fn.getPL = function(){
		return this.projectList;
	}

});

_add(PE,function(){
	PE.fn.init = function(){
		this.initRender();
		this.render();
		this.eventBind();
		var pickSlider = new partslider('.project-detail-slider');
		pickSlider.create();
	};

	PE.fn.initRender = function(){
		var pi = this.pi.option;
		var FileList = pi.ImgList;
		var html = "";
		for(var i = 0;i < FileList.length;i++){
			html += '<li><img src="'+FileList[i].icon+'"></li>'
		}
		FileList.html = html;
	}

	PE.fn.applyProcess = function(){
		var pi = this.pi.option;
		var self = this;
		var status = pi.Status;
		var $container = this.$container;

		//如果不是自己的项目，那么就提交申请。
		var data = {
			"UWSProjectID":pi.id,
			"Title":pi.Title,
			"Size":pi.Size,
			"Type":pi.Type,
			"Price":pi.SupplierAward,
			"CreateTime":"2016-9-27 14:45:43",
			"DeliveryTime":pi.DeliveryTime,
			"Status":1,
			"CountOfPerson":pi.CountOfPerson,
			"TokenID":TokenID
		}


			//提交申请
			$.ajax({
				url:'/projectApply',
				type:'post',
				contentType: "application/json; charset=utf-8",   //内容类型
				data:JSON.stringify(data),
				success:function(data){
					var postData = ungzip(data);
					postData = JSON.parse(postData);
					if(	flagProcess(postData) ){
						wsalert('申请成功');
					}
					else{
						return ;
					}

					var content = JSON.parse(postData.Content);
					var itemContent = JSON.parse(content.ItemContent);
					pi = itemContent;
					$container.find('[data-project-btn-apply]').hide();
				}
			});

	}

	PE.fn.eventBind = function(){
		//全局加载一次监听就可以了
		if(PE.on == true)
			return ;
		PE.on = true;
		var self = this;

		$container.on('click','[data-project-btn-apply]',function(e){
			self.applyProcess();
		});
	}

	var findLookUp = function(ApplyList,val){
		var num = 0;
		for(var i = 0;i < ApplyList.length;i++){
			if(ApplyList[i].LookUp == val){
				num ++;
			}
		}
		return num;
	}

	//对status字段的处理
	PE.fn.statusProcess = function(){
		var pi = this.pi.option;
		var $container = this.$container,
			status = pi.Status,
			need = pi.CountOfPerson;
		var staffNum = pi.ProStaffList.length,
			applyPassNum = findLookUp(pi.ApplyList,5);

		//初始化状态
		var className = "project-apply-btn";
		if(status){
			className = "";
		};

		//我虽然是负责人，但是如果人已经选满了，那么就和我没什么关系了
		if(need <= staffNum + applyPassNum)
			status = 1;
		
		switch(status){
			case 0:
			break;
			case 1:
			className = "project-pending-btn"
			break;
			case 2:
			break;
			case 3:
			className = "";
			break;
			case 4:
			break;
			case 5:
			break;
			case 6:
			break;
			case 7:
			break;
		}

		$container.find(PE.ui.status).attr('class',className);
	}

	PE.fn.render = function(){		
		$container = this.$container;
		pi = this.pi.option;
		var title = pi.Title,
			work = pi.Type,
			num = '3人',
			FileList = pi.ImgList,
			ReleaseTime = pi.ReleaseTime,
			EmployeeAward = pi.PriceList.EmployeeAward;

		$container.find(PE.ui.title).html(title);
		$container.find(PE.ui.work).html(work)
		$container.find(PE.ui.num).html(num)
		$container.find(PE.ui.icon).attr('src',pi.ProjectIcon||'./img/project_1.gif');
		$container.find(PE.ui.slider).html(FileList.html);
		$container.find(PE.ui.award).html(EmployeeAward);
		$container.find(PE.ui.deadline).html(ReleaseTime);
		//项目状态处理
		this.statusProcess();
		//渲染评论列表
		this.renderComment();
	}

	PE.fn.renderComment = function(){
		$container = this.$container;
		pi = this.pi.option;
		//初始化内容
		$container.find(PE.ui.comment).html('');
		if(typeof pi.DiscussHtmlStrList != 'string'){
			$container.find(PE.ui.comment).html("无内容");
			return ;
		}

		var discuss = JSON.parse(pi.DiscussHtmlStrList);
		$.each(discuss,function(i,e){
			getUserByUserID(e.UserID,function(err,data){
				var UserInfo = JSON.parse(data.Content);
				$.extend(e,UserInfo);
				getThumbUrl(e.PhotoName,function(err,url){
					e.PhotoName = url;
					$container.find(PE.ui.comment).append(GetComment(e));
				})
				
			});
		});			
	}

	var GetComment = function(option){
		var author = option.NickName,
			datetime = option.CreateTime,
			content = option.Content,
			img = option.PhotoName||"./img/icon/profile.png";

        var html =	'<li>'+
                        '<article class="am-comment">' +
                          '<a href="">'+
                            '<img class="am-comment-avatar" alt="" src="'+img+'"/>'+ 
                          '</a>'+
                          '<div class="am-comment-main">' +
                            '<header class="am-comment-hd">'+
                              '<div class="am-comment-meta">'+
                                '<a href="#link-to-user" class="am-comment-author">'+author+'</a>'+
                                '评论于'+'<time datetime="">'+datetime+'</time>'+
                              '</div>'+
                            '</header>'+
                            '<div class="am-comment-bd">'+content+'</div>'
                          '</div>'+
                        '</article>'+                        
                      '</li>';
        return html;
	}

	PE.ui = {};
	PE.ui.title = '[data-project-title]';
	PE.ui.work = '[data-project-work]';
	PE.ui.num = '[data-project-num]';
	PE.ui.deadline = '[data-project-deadline]';
	PE.ui.icon = '[data-project-icon]';
	PE.ui.slider = '[data-project-slider]';
	PE.ui.comment = '[data-project-comment]';
	PE.ui.award = '[data-project-award]';
	PE.ui.status = '[data-project-status]';
	PE.on = false;
})


_add(PP,function(){
	PP.fn.init = function(){
	
	}

	var getStar = function(num){
		num = num>=5?5:num;
		var star = "",
			unstar = "";
		for(var i = 0;i < num;i++){
			star  +=  '<i class="am-header-icon am-icon-star  blueword">'+'</i>';
		}		 
		for(var i = 0;i < 5 - num;i++){
			unstar += '<i class="am-header-icon am-icon-star-o  ">'+'</i>';
		}
		var html = '<div class="profile-info-c">'+
	               star +
	               unstar+          
				'</div>'
		return html;
	}

	PP.fn.renderUser = function(cb){
		var option = this.option,
			UserID = option.UserID;
		getUserByUserID(UserID,function(err,data){
			$.extend(option,data);
			cb(option);
		});
	}

	PP.fn.getUserHead = function(cb){
		var option = this.option,
		img = option.MainImage;
		getThumbUrl(img,cb);
	}


	PP.fn.render = function(){
		var option = this.option,
			score = option.Score,
			UserID = option.UserID,
			img = option.MainImage||"./img/profile-head.png",
			name = option.NickName||"姓名",
			skillList = option.SkillList||[],
			Attendance = option.Attendance,
			Stability = parseInt(option.Stability),
			index = option.index,
			eofd = parseInt(option.EvaluationOfDirector||0),
			ea = parseInt(option.ExploringAbility||0),
			ca = parseInt(option.CooperationAbility||0),
			ccp = parseInt(option.CountOfCompletedProjects||skillList.length),
			information = option.profile;

		var skillHtml = "";
		var skillScoreHtml = "";
		for(var i = 0;i < skillList.length;i++){
			skillHtml +=   '<div class="profile-info-n">'+skillList[i]+':</div>';
			skillScoreHtml += getStar(0);
		}

		
   var html = '<li>'+           
                '<div class="person-profile clearfix" data-profile-userid-'+UserID+'>'+            
                  
                  '<div class="profile-sure blackword" data-project-sure data-project-index="'+index+'">'+
                       '<i class="am-icon-check-circle-o whiteword">'+'</i>'+
                  '</div>'+  

                  '<div class="profile-head">'+
                    '<div class="profile-score" data-profile-sorce>'+   
                    	score+                 
                    '</div>'+
                    '<div class="profile-img">'+
                      '<img data-profile-img src="'+img+'">'+
                    '</div>'+
                    '<div class="profile-name" data-profile-name>'+name+'</div>'+
                  '</div>'+
                  getInformation(information) +
                  '<div class="profile-info">'+              
                    '<div class="profile-info-item clearfix">'+
                      '<div class="profile" data-profile-skill>'+'技能'+'</div>'+
                      '<div class="profile-info-b left">'+
                      	skillHtml+                       
                      '</div>'+
                      
                      '<div class="profile-info-a right">'+
                         skillScoreHtml+
                      '</div>'+

                    '</div>'+
                    
                    '<div class="profile-info-item clearfix">'+
                      '<div class="profile">'+'素质'+'</div>'+
                      '<div class="profile-info-b left">'+
                        '<div class="profile-info-n">'+'稳定性：'+'</div>'+
                        '<div class="profile-info-n">'+'协作能力：'+'</div>'+
                        '<div class="profile-info-n">'+'项目经理评价：'+'</div>'+        		
                        '<div class="profile-info-n">'+'探索能力：'+'</div>'+
                        '<div class="profile-info-n">'+'完成项目数量：'+'</div>'+              
                        '<div class="profile-info-n">'+'考勤：'+'</div>'+              
                      '</div>'+                
                      '<div class="profile-info-a right">'+
                      			getStar(Stability)+
                      			getStar(ca)+
                      			getStar(eofd)+
                      			getStar(ea)+
                          '<div class="profile-info-c">'+
                              ccp + '个项目'+
                          '</div>'+
                          '<div class="profile-info-c">'+
                             Attendance+
                          '</div>'+
                      '</div>'+
                    '</div>'+                        
                    '<!--项目-->'+
                    '<div class="profile-info-item clearfix profile-p-info-project">'+
                      '<div class="profile-title">'+'项目'+'</div>'+
                        
                        '<div class="profile-p clearfix">'+
                          '<div class="profile-p-img left">'+
                            '<img src="./img/project_1.gif">'+
                          '</div>'+
                          
                          '<div class="profile-p-info right ">'+
                            '<div class="profile-p-info-b greyword left">'+
                              '<div class="profile-p-item">'+'项目名称：'+'</div>'+
                              '<div class="profile-p-item">'+'项目所需技能：'+'</div>'+
                              '<div class="profile-p-item">'+'项目经理评价：'+'</div>'+
                            '</div>'+
                            '<div class="profile-p-info-a right">'+
                              '<div class="profile-p-item">'+'南非草地狩猎'+'</div>'+
                              '<div class="profile-p-item">'+'翻译-文档-文案'+'</div>'+
                              '<div class="profile-p-item">'+
                                '<i class="am-header-icon am-icon-star  blueword">'+'</i>'+
                                '<i class="am-header-icon am-icon-star  blueword">'+'</i>'+
                                '<i class="am-header-icon am-icon-star  blueword">'+'</i>'+
                                '<i class="am-header-icon am-icon-star  blueword">'+'</i>'+
                                '<i class="am-header-icon am-icon-star-o  ">'+'</i>'+
                              '</div>'+
                            '</div>'+
                          '</div>'+
                        '</div>'+
                    
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</li>'
        return html;
	}

	var getInformation = function(pf){
		if(!pf){
			return "";
		}

		var ac = pf.Account,
			sex = pf.Sex,
			em = pf.Email,
			fn = pf.FirstName,
			ln = pf.LastName;
			cl = pf.ContactList;

	var getInfo_n = function(str){
		return '<div class="profile-info-n">'+str+'</div>';
	}

	var getInfo_l = function(str){
		return '<div class="profile-info-c">'+str+'</div>';
	}

	var html = '<div class="profile-info-item clearfix">'+
                      '<div class="profile">'+'个人资料'+'</div>'+                      
                      '<div class="profile-info-b left">'+
                      
                        getInfo_n('账号:')+getInfo_n('姓:')+getInfo_n('名:')+getInfo_n('性别:')+           
                      '</div>'+                
                      '<div class="profile-info-a right">'+
                        getInfo_l(ac)+getInfo_l(fn)+getInfo_l(ln)+getInfo_l(sex)+
                      '</div>'+
                '</div>'; 
        var clHtml = "";
        var ciHtml = "";
        for(var i = 0;i < cl.length;i++){
        	clHtml +=getInfo_n(cl[i].Key);
        	ciHtml +=getInfo_l(cl[i].Value);
        }

  	    html += '<div class="profile-info-item clearfix">'+
                      '<div class="profile">'+'联系方式'+'</div>'+                      
                      '<div class="profile-info-b left">'+
                        getInfo_n('Email:')+clHtml+
                      '</div>'+                
                      '<div class="profile-info-a right">'+
                          getInfo_l(em)+ciHtml+        
                      '</div>'+
                '</div>';

        return html;
	}

});

_add(PPP,function(){
	PPP.fn.init = function(){
		this.sureList = [];
		this.render();
		this.eventBind();
	}

	PPP.fn.eventBind = function(){
		if(PPP.bind == true)
			return;
		PPP.bind = true;
		var self = this;
		var $container = this.$container;
		var option = this.option.option;
		var ApplyList = this.option.option.ApplyList,
			sureList = this.sureList;
		//绑定选择人数
		$container.on('click',PPP.btn.sure, function(e) {
			var $elem = $(e.currentTarget);
			$elem.find('i').toggleClass('blackword');
			var index = $elem.attr('data-project-index');
			for(var i = 0;i < sureList.length;i++){
				if(sureList[i] == index){
					sureList[i] = -1;
					return ;
				}
			}
			sureList.push(index);
		});

		//绑定提交选人
		$container.on('click',PPP.btn.check, function(e){
			//封装数据
			e.preventDefault();
			if(self.sureList.length == 0)
				return ;

			var staffList = [];
			for(var i = 0;i < sureList.length;i++){
				if(sureList[i] == -1)
					continue;
				staffList.push(ApplyList[sureList[i]]);
			}
			
			var postData = {
				"UWSProjectID":option.UWSProjectID,
				"ProStaffList":staffList,
				"TokenID":TokenID
			};
			$.ajax({
				url:"/projectPick",
				type:'Post',
				contentType: "application/json; charset=utf-8",   //内容类型
				data:JSON.stringify(postData),
				success:function(data){
					data = ungzip(data);
					data = JSON.parse(data);
					if(flagProcess(data)){
						wsalert('选择成功');
					};
					var content = JSON.parse(data.Content);
					var p = JSON.parse(content.ItemContent);
					option = p;
					self.init();
				}
			});
		});
	}

	PPP.fn.judge = function(ai,cb){
		var UserID = ai.UserID;
		var UWSProjectID = this.option.option.UWSProjectID;
		getMyProject(UserID,function(err,data){
			if(err){alert(err);return;}
			for(var i = 0;i < data.length;i++)
				if(data[i].UWSProjectID == UWSProjectID && data[i].Status == 1){
					return cb(false)		
				}
			cb(true);
		})
	}

	PPP.fn.render = function(){
		var option = this.option.option,
			title = option.Title,
			count = 0;
		var staffList = option.ProStaffList;

		var $container = this.$container;
		$container.find(PPP.ui.title).html(title);
		$container.find(PPP.ui.count).html("0");
		
		var html = "";
		
		var ep = new EventProxy();

		for(var i = 0;i < option.ApplyList.length;i++){
			var ApplyItem = option.ApplyList[i];
			//塞入index
			ApplyItem.index = i;
			this.judge(ApplyItem,function(judge){
				if(judge == false){
					var pp = new PP(ApplyItem);
					html+=pp.render();
					ep.emit('pp_render',html);
					pp.renderUser(function(data){
						var $profile = $container.find('[data-profile-userid-'+data.UserID+']');
						var $name = $profile.find('[data-profile-name]'),
							$work = $profile.find('[data-profile-work]'),
							$img = $profile.find('[data-profile-img]');
						var content = JSON.parse(data.Content);
						var name = content.NickName,
							photo = content.PhotoName||'./img/profile-head.png';
						$name.html(name),
						$img.attr('src',photo);
					});
					count++;
					$container.find(PPP.ui.count).html(count);
				}
				else{
					ep.emit('pp_render',"");
				}
			});
		}

		ep.after('pp_render',option.ApplyList.length,function(data){
			var html = data.join("");
			$container.find(PPP.ui.pick).html(html);	
			pickSlider = new partslider('.partslider-pick');
			pickSlider.create();
			//请求的人数
		});	
	} 

	PPP.ui = {};
	PPP.btn = {};
	PPP.ui.title = "[data-project-title]";
	PPP.ui.count = "[data-project-count]";
	PPP.ui.pick = "[data-project-pick]";
	PPP.btn.sure = "[data-project-sure]";
	PPP.btn.check = "[data-project-check]";
	PPP.bind = false;
})

_add(SC,function(){

	SC.fn.init = function(){
		this.render();
		this.renderFiles();
		this.eventBind();
	}

	SC.fn.eventBind = function(){
	}

	SC.fn.renderFiles = function(){
		var o = this.option;
		for(var i = 0 ;i < o.length;i++){
			var sl = new sourceList("[data-source-id=\""+o[i].id+"\"]");
			for(var j = 0,f = o[i].FileList;j < o[i].FileList.length;j++){
				sl.addSource(new sourceItem(f[j]));
			}
		}
	}

	SC.fn.render = function(){
		var option = this.option;
		var demand = "",val = "",workflow = "",info = "";
		for(var i = 0,o = option;i < option.length;i++){	
			switch(o[i].ReqTag){
				case 0:
					demand += this.getHtml(o[i].ReqName,"<div class=\"source-list\" data-source-id=\""+o[i].id+"\">asd</div>","");
				break;
				case 5:
					val += this.getHtml(o[i].ReqName,"<div class=\"source-list\" data-source-id=\""+o[i].id+"\">asd</div>","");
				break;
				case 3:
					workflow += this.getHtml(o[i].ReqName,"<div class=\"source-list\" data-source-id=\""+o[i].id+"\">asd</div>","");
				break;
				case 6:
					info += this.getHtml(o[i].ReqName,"<div class=\"source-list\" data-source-id=\""+o[i].id+"\">asd</div>","");
				break;
			}
		}
		var body = this.getHtml('需求项',demand,SC.ui.demand)+this.getHtml('评估',val,SC.ui.val)
				   +this.getHtml('工作流',workflow,SC.ui.workflow)+this.getHtml('信息',info,SC.ui.info);
		this.$container.html(body);
	}

	SC.fn.getHtml = function(title,body,data_id){
		var html =    '<div class="source-collapse" '+data_id+' >'+
                          '<div class="source-collapse-head clearfix">'+
                            '<div class="source-collapse-title left">'+title+'</div>'+
                            '<div class="source-uncollaps right">'+'<i class="am-icon-chevron-down">'+'</i>'+'</div>'+
                          '</div>'+
                          '<div class="source-collapse-body">'+ 
                          	body+                      		
                          '</div>'+                          
                      '</div>';
        return html;
	}


	SC.fn.renderSource = function(files,ui){
		var $container = this.$container;
		var $sourceContainer = $container.find(getS(ui)).find('.source-collapse-body');
		var selector = $sourceContainer.selector;
		var sList = new sourceList(selector);
		for(var i = 0;i < files.length;i++){
			sList.addSource( new sourceItem(files[i]));
		}
	}

	SC.ui = {};
	SC.ui.wrapper = 'data-source-collapse-wrapper';
	SC.ui.demand = 'data-source-collapse-demand';
	SC.ui.val = 'data-source-collapse-val';
	SC.ui.workflow = 'data-source-collapse-workflow';
	SC.ui.info = 'data-source-collapse-info';

})


_add(APM,function(){

	APM.fn.init = function(){
		this.model = 'app-model-myproject';
		this.lastMode = 'app-model-myproject';
		this.render();
		this.eventBind();
	};

	APM.fn.eventBind = function(){
		var self = this;
		var $container = this.$container;
		$container.on('click',APM.btn.control, function(e) {
			event.preventDefault();
			var $elem = $(e.currentTarget);
			self.model = $elem.attr('data-app-model');
			self.render();
		});
	}

	APM.fn.render = function(){
		var $container = this.$container;
		$container.removeClass(this.lastModel);
		$container.addClass(this.model);
		this.lastModel = this.model;
	}
	APM.initModel = 'app-model-myproject';
	APM.btn = {};
	APM.btn.control = '[data-app-control]';
});

})(jQuery);
