define([], function() {
	scrollWindow();
	calendarShow();
	poshyTipShow();
	showPopLayer();
	pictureShow();
	pagingShow();
	showForm();

	// 滚动页面事件
	function scrollWindow(){
		var initNavTop = $('.dm_nav').offset().top;
		scrollHanlder();
		setTimeout(function() {
          ["scroll", "touchmove"].forEach(function(evtName) {
            $(window).on(evtName, scrollHanlder);
          }.bind(this));
        }.bind(this), 500);

        function scrollHanlder(){
        	this.scrollTop = $(window).scrollTop();
			var isStickyNav = this.scrollTop >= initNavTop;
			if (isStickyNav && !$('.dm_nav').hasClass('dm_fixNav')) {
				$('.dm_nav').addClass('dm_fixNav');
			}else if(!isStickyNav && $('.dm_nav').hasClass('dm_fixNav')){
				$('.dm_nav').removeClass('dm_fixNav');
			}
        }
	}

	// 日历
	function calendarShow(){
		$('#txtShowCalendar').click(function(){
			Turtle.laydate({
			    elem: '#txtShowCalendar', //目标元素。elem还允许你传入class、tag但必须按照这种方式 '#id .class'
			});
		});
		$('#txtShowCalendarSelf').click(function(){
			Turtle.laydate({
			    elem: '#txtShowCalendarSelf', //需显示日期的元素选择器
		        event: 'click', //触发事件
		        format: 'YYYY-MM-DD hh:mm:ss', //日期格式
		        istime: false, //是否开启时间选择,即可选几点几分几秒
		        isclear: true, //是否显示清空按钮
		        istoday: true, //是否显示今天按钮
		        issure: true, //是否显示确认按钮
		        festival: true, //是否显示节日，国庆、元旦、清明等阳历节日
		        init: false,//是否在elem中显示当前时间，默认为false
		        min: '1900-01-01 00:00:00', //最小日期，可选的最小日期
		        max: '2099-12-31 23:59:59', //最大日期，可选的最大日期
		        start: '2014-6-15 23:00:00',    //如果init==false，把start设置为开始日期，如果init==true时，该值无效。即如果elem有值，该值无效
		        fixed: false, //是否固定在可视区域
		        zIndex: 99999999, //css z-index
		        choose: function(dates){ //选择好日期的回调,dates是选择日期的字符串，如“2016-09-21 12:57:27”
		        }
			});
		});	
		$('#showCalendarA').click(function(){
			Turtle.laydate({
			    elem: '#txtShowCalendar2', 
			});
		});
		$('#txtShowCalendar3').click(function(){
			Turtle.laydate({
			    elem: '#txtShowCalendar3', 
			    format: 'YYYY/MM', // 分隔符可以任意定义，该例子表示只显示年月
	    		festival: true, //显示节日
	    		choose: function(dates){ 
	    			window.console && console.log(dates);
		        }
			});
		});
		$('#txtShowCalendar4').click(function(){
			Turtle.laydate({
			    elem: '#txtShowCalendar4', 
			    min: Turtle.laydate.now(-1), //-1代表昨天，-2代表前天，以此类推
	    		max: Turtle.laydate.now(+1) //+1代表明天，+2代表后天，以此类推
			});
		});
		var start = {
		    elem: '#txtShowCalendarBegin',
		    format: 'YYYY/MM/DD hh:mm:ss',
		    min: Turtle.laydate.now(), //设定最小日期为当前日期
		    max: '2099-06-16 23:59:59', //最大日期
		    istime: true,
		    istoday: false,
		    choose: function(datas){
		         end.min = datas; //开始日选好后，重置结束日的最小日期
		         end.start = datas //将结束日的初始值设定为开始日
		    }
		};
		var end = {
		    elem: '#txtShowCalendarEnd',
		    format: 'YYYY/MM/DD hh:mm:ss',
		    min: Turtle.laydate.now(),
		    max: '2099-06-16 23:59:59',
		    istime: true,
		    istoday: false,
		    choose: function(datas){
		        start.max = datas; //结束日选好后，重置开始日的最大日期
		    }
		};
		$('#txtShowCalendarBegin').click(function(){
			Turtle.laydate(start);
		});
		$('#txtShowCalendarEnd').click(function(){
			Turtle.laydate(end);
		});		
		// 其他颜色皮肤
		var skinList=['dahong','danlan','molv','qianhuang','yahui','yalan','huanglv'];
		for(var i=0;i<skinList.length;i++){
			var fun=function(v){
				return function(){
					Turtle.laydate({
					    elem: '#txtShowCalendarSkin'+(v+1),
					    format: 'YYYY-MM-DD hh:mm:ss',
					    istime: true,
					    skin: skinList[v]
					});
				}
			}
			$('#txtShowCalendarSkin'+(i+1)).click(fun(i));
		}
	}

	// 气泡弹层提示
	function poshyTipShow(){
		// 各种颜色皮肤
		var skinList=['yellow','yellowsimple','violet','twitter','skyblue','green','darkgray'];
		for(var i=0;i<skinList.length;i++){
			$('#showPoshyTipColors'+(i+1)).poshytip({className: 'tip-'+skinList[i],alignTo: 'target',alignX: 'center',hideTimeout:1, offsetY: 5,allowTipHover:false});
		}
		$('#showAll').click(function(){
			for(var i=0;i<skinList.length;i++){
				$('#showPoshyTipColors'+(i+1)).poshytip('hide');
				// 先重置参数，修改showOn:'none'，方式鼠标移动到上面后，离开隐藏提示信息。
				$('#showPoshyTipColors'+(i+1)).poshytip({className: 'tip-'+skinList[i],alignTo: 'target',alignX: 'center',hideTimeout:1,offsetY: 5,allowTipHover:false,showOn:'none'});
				$('#showPoshyTipColors'+(i+1)).poshytip('show');
			}
		});
		$('#hideAll').click(function(){
			for(var i=0;i<skinList.length;i++){
				$('#showPoshyTipColors'+(i+1)).poshytip('hide');
				// 恢复原来的初始化参数
				$('#showPoshyTipColors'+(i+1)).poshytip({className: 'tip-'+skinList[i],alignTo: 'target',alignX: 'center',hideTimeout:1,offsetY: 5,allowTipHover:false});
			}
		});

		$('#showPoshyTip1').poshytip({
			content: 'hello,你好！',
			showTimeout: 1,
			alignTo: 'target',
			alignX: 'center',
			hideTimeout:1,
			offsetY: 5,
		});
		$('#showPoshyTip2').poshytip({
			content: 'hello,你好！',
			showTimeout: 1,
			alignTo: 'target',
			alignX: 'right',
			alignY: 'center',
			hideTimeout:1,
			offsetX: 5
		});
		$('#showPoshyTip3').poshytip({
			content: 'hello,你好！',
			showTimeout: 1,
			alignTo: 'target',
			alignX: 'center',
			alignY: 'bottom',
			hideTimeout:1,
			offsetY: 5
		});
		$('#showPoshyTip4').poshytip({
			content: 'hello,你好！',
			showTimeout: 1,
			alignTo: 'target',
			alignX: 'left',
			alignY: 'center',
			hideTimeout:1,
			offsetX: 5
		});
		// 个性化
		$('#showPoshySelf1').poshytip({
			content: '站住，你已经被包围了！',
			showTimeout:1,
			hideTimeout:1,
			showOn:'hover',
			alignTo:'cursor',
			followCursor:true
		});
		$('#showPoshySelf2').poshytip({
			content: '入即显示，出即隐藏！',
			showTimeout:1,
			hideTimeout:1,
			fade:false,
			slide:false
		});
		$('#showPoshySelf3').poshytip({
			content: '你好:<p style="margin:2px 10px;">Alec Yin</p>敬礼！',
			showTimeout:1,
			hideTimeout:1
		});
		$('#showPoshySelf4').poshytip({
			content: '<img style="width:400px;height:400px;" src="images/my.jpg"/>',
			bgImageFrameSize:1,
			showTimeout:1,
			hideTimeout:1,
			showOn:'hover',
			alignTo:'cursor',
			followCursor:true
		});
		$('#showPoshySelf5').poshytip({
			content: function(updateCallback) {
				window.setTimeout(function() {
					updateCallback('提示更新完毕!');
				}, 1200);
				return '加载中...';
			}
		});

		// input 提示
		$('#showPoshyInput1').poshytip({
			className: 'tip-yellowsimple',
			showOn: 'focus',
			alignTo: 'target',
			alignX: 'right',
			alignY: 'center',
			offsetX: 5
		});
		$('#showPoshyInput2').poshytip({
			className: 'tip-yellowsimple',
			showOn: 'focus',
			alignTo: 'target',
			alignX: 'left',
			alignY: 'center',
			offsetX: 5
		});
		$('#showPoshyInput3').poshytip({
			className: 'tip-yellowsimple',
			showOn: 'focus',
			alignTo: 'target',
			alignX: 'inner-left',
			offsetX: 0,
			offsetY: 5
		});
		$('#showPoshyInput4').poshytip({
			className: 'tip-yellowsimple',
			showOn: 'focus',
			alignTo: 'target',
			alignX: 'center',
			alignY: 'bottom',
			offsetX: 0,
			offsetY: 5
		});

		//来自Layer弹框
		$('#showTip1').on('click', function(){Turtle.layer.tips('气泡泡!', '#showTip1',{tips:1});});
		$('#showTip2').on('click', function(){Turtle.layer.tips('气泡泡!', '#showTip2',{tips:2});});
		$('#showTip3').on('click', function(){Turtle.layer.tips('气泡泡!', '#showTip3',{tips:3});});
		$('#showTip4').on('click', function(){Turtle.layer.tips('气泡泡!', '#showTip4',{tips:4});});

		$('#showTip5').on('click', function(){Turtle.layer.tips('气泡泡!', '#showTip5',{tips: [1, '#c00']});});
		$('#showTip6').on('click', function(){Turtle.layer.tips('气泡泡!', '#showTip6',{success: function(layero, index){
	    	console.log(layero, index);
	    	alert('弹出成功！');
	  	}});});
	}

	// 弹出层
	function showPopLayer () {
		$('#showMsg').click(function(){
			Turtle.layer.msg('Hello layer');
		});
		$('#showMsg2').click(function(){
			Turtle.layer.msg('Hello layer',{shade:0.5,shadeClose:true,time:4000,closeBtn:1});
		});
		$('#showMsg3').click(function(){Turtle.layer.msg('Hello layer',{shade:0.5,fix:false});});
		$('#showMsg4').click(function(){Turtle.layer.msg('Hello layer',{shade:0.5,scrollbar:false});});
		// 7种动画效果
		$('#showMsgShift0').click(function(){Turtle.layer.msg('Hello layer',{shift:0});});
		$('#showMsgShift1').click(function(){Turtle.layer.msg('Hello layer',{shift:1});});
		$('#showMsgShift2').click(function(){Turtle.layer.msg('Hello layer',{shift:2});});
		$('#showMsgShift3').click(function(){Turtle.layer.msg('Hello layer',{shift:3});});
		$('#showMsgShift4').click(function(){Turtle.layer.msg('Hello layer',{shift:4});});
		$('#showMsgShift5').click(function(){Turtle.layer.msg('Hello layer',{shift:5});});
		$('#showMsgShift6').click(function(){Turtle.layer.msg('Hello layer',{shift:6});});
		// 8种提示类型
		$('#showAlert').click(function(){Turtle.layer.alert('Hello layer');});
		$('#showAlert0').click(function(){Turtle.layer.alert('Hello layer',{icon: 0,});});
		$('#showAlert1').click(function(){Turtle.layer.alert('Hello layer',{icon: 1,});});
		$('#showAlert2').click(function(){Turtle.layer.alert('Hello layer',{icon: 2,});});
		$('#showAlert3').click(function(){Turtle.layer.alert('Hello layer',{icon: 3,});});
		$('#showAlert4').click(function(){Turtle.layer.alert('Hello layer',{icon: 4,});});
		$('#showAlert5').click(function(){Turtle.layer.alert('Hello layer',{icon: 5,});});
		$('#showAlert6').click(function(){Turtle.layer.alert('Hello layer',{icon: 6,});});
		// 拖动行为
		$('#showAlert7').click(function(){Turtle.layer.alert('Hello layer',{move: false});});
		$('#showAlert8').click(function(){Turtle.layer.alert('Hello layer',{move: '.layui-layer-content'});});
		$('#showAlert9').click(function(){Turtle.layer.alert('Hello layer',{moveType: 0});});
		$('#showAlert10').click(function(){Turtle.layer.alert('Hello layer',{moveType: 1});});
		$('#showAlert11').click(function(){Turtle.layer.alert('Hello layer',{moveOut: false});});
		$('#showAlert12').click(function(){Turtle.layer.alert('Hello layer',{moveOut: true});});
		$('#showAlert13').click(function(){Turtle.layer.alert('Hello layer',{moveEnd: function(){
			alert('拖动结束')
		}});});
		// 询问框
		$('#showConfirm').click(function(){
			Turtle.layer.confirm('你好吗？');
		});
		$('#showConfirm2').click(function(){
			Turtle.layer.confirm('你好吗？',{icon:3,title:'提示'},function(index){
				Turtle.layer.close(index);
			});
		});
		$('#showConfirm3').click(function(){
			Turtle.layer.confirm('你好吗？', {
				btn: ['好', '凑活', '不好'],
				btn1: function(index) {
					Turtle.layer.alert('你很好！')
					Turtle.layer.close(index);
				},
				btn2: function(index) {
					Turtle.layer.alert('凑活就行！');
					Turtle.layer.close(index);
				},
				btn3: function(index) {
					Turtle.layer.alert('瞎愁啥！');
					Turtle.layer.close(index);
				}
			});
		});

		//自定义弹出层
		$('#showSelfCeng').click(function() {
			Turtle.layer.open({
				type: 1,
				area: ['600px', '360px'],
				shadeClose: true, //点击遮罩关闭
				content: '\<\div style="padding:20px;">自定义内容，点击遮罩关闭\<\/div>'
			});
		});
		$('#showSelfCeng2').click(function() {
			Turtle.layer.open({
				type: 1,
				maxmin:true,
				area: ['600px', '360px'],
				shadeClose: true, //点击遮罩关闭
				content: '\<\div style="padding:20px;">自定义内容，点击遮罩关闭\<\/div>'
			});
		});
		//弹出一个iframe层
		$('#showIframe').on('click', function() {
			Turtle.layer.open({
				type: 2,
				title: 'iframe父子操作',
				maxmin: true,
				shadeClose: true, //点击遮罩关闭层
				area: ['500px', '320px'],
				content: 'pageForLayerpop.html'
			});
		});
		//加载中动画Loading
		$('#showLoadingPop').on('click', function() {
			var ii = Turtle.layer.load(0,{shade:0.3});
			setTimeout(function() {
				Turtle.layer.close(ii);
			}, 1000);
		});
		$('#showLoadingPop1').on('click', function() {
			var ii1 = Turtle.layer.load(1,{shade:0.5});
			setTimeout(function() {
				Turtle.layer.close(ii1);
			}, 1000);
		});
		$('#showLoadingPop2').on('click', function() {
			var ii2 = Turtle.layer.load(2,{shade:0.5});
			setTimeout(function() {
				Turtle.layer.close(ii2);
			}, 1000);
		});
		$('#showLoadingPop3').on('click', function() {
			Turtle.layer.msg('加载中...', {shade:0.5,icon: 16});
		});		
	  	// 输入型弹框
	  	$('#showPrompt').click(function(){
	  		Turtle.layer.prompt({
	  			title:'请输入姓名，并确认',
	  			formType:0,
	  		},function(name){
	  			 Turtle.layer.msg('你好，'+name);
	  		})
	  	});
	  	$('#showPrompt2').click(function(){
	  		Turtle.layer.prompt({
	  			title:'请输入密码，并确认',
	  			formType:1,
	  		},function(pwd){
	  			 Turtle.layer.msg('口令为：'+pwd);
	  		})
	  	});
	  	$('#showPrompt3').click(function(){
	  		Turtle.layer.prompt({
	  			title:'请输入自我介绍，并确认',
	  			formType:2,
	  		},function(txt){
	  			 Turtle.layer.msg(txt);
	  		})
	  	});
	  	$('#showPrompt4').click(function(){
	  		Turtle.layer.prompt({
	  			title:'请输入6个字符，并确认',
	  			value:'abc-',
	  			maxlength:6,
	  			formType:0
	  		},function(txt){
	  			 Turtle.layer.msg(txt);
	  		})
	  	});

	  	// 弹出Tab
	  	$('#showLayerTab').click(function(){
			Turtle.layer.tab({
				area: ['600px', '300px'],
				tab: [{
					title: 'TAB1',
					content: '内容1'
				}, {
					title: 'TAB2',
					content: '内容2'
				}, {
					title: 'TAB3',
					content: '内容3'
				}]
			});
	  	});
	}

	// 图片展示
	function pictureShow () {
		// 图片轮播
		$('.imgSliderDiv').createImgSlider({
			imgList:[{
				url:'images/lb1.jpg',
				desc:'这是第一个图片的说明文字。'
			},{
				url:'images/lb2.jpg',
				desc:'这是第二个图片的说明文字。'
			},{
				url:'images/lb3.jpg',
				desc:'这是第三个图片的说明文字。'
			}]
		})
		// photo	
		$('#showPhoto').click(function() {
			/*
				json需严格按照如下格式：
				{
					"title": "", //相册标题
					"id": 123, //相册id
					"start": 0, //初始显示的图片序号，默认0
					"data": [ //相册包含的图片，数组格式
						{
							"alt": "图片名",
							"pid": 666, //图片id
							"src": "", //原图地址
							"thumb": "" //缩略图地址
						}
					]
				}
			*/
			var json = {
				"status": 1,
				"msg": "",
				"title": "JSON请求的相册",
				"id": 8,
				"start": 0,
				"data": [{
					"alt": "越来越喜欢观察微小的事物",
					"pid": 109,
					"src": "images/lb1.jpg",
					"thumb": ""
				}, {
					"alt": "决定，意味着对与错的并存",
					"pid": 110,
					"src": "images/lb2.jpg",
					"thumb": "images/lb2.jpg"
				}, {
					"alt": "梦想还是要有的，万一实现了呢",
					"pid": 111,
					"src": "images/lb3.jpg",
					"thumb": "images/lb3.jpg"
				}, {
					"alt": "人与人关系图",
					"pid": 112,
					"src": "images/lb4.jpg",
					"thumb": ""
				}, {
					"alt": "那忧郁的眼神，含着一丝晶莹的泪花",
					"pid": 113,
					"src": "images/lb5.jpg",
					"thumb": "images/lb5.jpg"
				}]
			}
			Turtle.layer.photos({
				photos: json,
				shift:1 //不传动画效果，随机播放
			});
		});
		$('#showPhoto2').click(function() {
			Turtle.layer.photos({
			    photos: '#layer-photos-demo'
			 });
			$('#layer-photos-demo img:first').click();
		});
	}

	// 分页
	function pagingShow () {
		// url跳转
		var pageIndex = Turtle.getQueryString('pageIndex');
        pageIndex = pageIndex ? +pageIndex - 1 : 0;

        // pageTotal 总条数
	    // pageIndex 当前页索引
	    // pageSize 每页显示条数，默认12条
	    // isInputPageIndex 是否允许输入跳转页索引
	    // isShowTotal 是否显示总条数
	    // onPageClick 点击分页执行方法
		$('.pageDiv').createPage({
			pageTotal:100,
			pageIndex:pageIndex,
			isShowTotal:true,
			isInputPageIndex:true
		});
		$('.pageDiv2').createPage({
			pageTotal:50,
			pageIndex:pageIndex,
			isShowTotal:true
		});
		$('.pageDiv3').createPage({
			pageTotal:50,
			pageIndex:pageIndex
		});

		// ajax分页
		function getPageAjax (pageIndex,pageTotal,pageSize) {
			$('.pageDivAjax').createPageAjax({
				pageTotal:pageTotal,
				pageIndex:pageIndex,
				pageSize:pageSize,
				isShowTotal:true,
				isInputPageIndex:true,
				onPageClick:function(pIndex) {
					//点击分页时调用，该方法中会调用ajax重新渲染分页
					mockPageAjax(pageSize, pIndex-1);
				}.bind(this)
			});
		}
		// 每页显示10条，当前索引0
		mockPageAjax(10,0);
		// 模拟分页时的ajax方法
		function mockPageAjax(pageSize,pIndex) {
			// Turtle.ajax.GetJsonP('ajax url',{pageSize:pageSize,pageIndex:pIndex},function(data){
			// 	var pageIndex = data.pageIndex,pageTotal = data.;
			// 	this.getPageAjax(pageIndex,pageTotal,pageSize);
			// }.bind(this));
			
			// 以上是正式访问的代码，下面模拟ajax请求
			Turtle.showLoading();
			setTimeout(function(){
				// 这里的总条数和当前索引应该是接口返给我的
				var pageTotal = 120;
				getPageAjax(pIndex,pageTotal,pageSize);
				Turtle.hideLoading();
			}.bind(this), 300)
		}
	}

	// 表单控件
	function showForm(){
		// 下拉框
		$('.dm_showSelect1').uiSelect({
			data:[{id:1,title:'河南'},
					{id:2,title:'山东'},
					{id:3,title:'山西'},
					{id:4,title:'河北'},
					{id:5,title:'湖北'},
					{id:6,title:'上海'}],
			placeholder:'请选择一个省份'
		});
		$('.dm_showSelect2').uiSelect({
			data:[{id:1,title:'平凡的世界'},
					{id:2,title:'围城'},
					{id:3,title:'放风筝的人'},
					{id:4,title:'从你的世界走过'},
					{id:5,title:'麻衣神相'},
					{id:6,title:'水浒传'},
					{id:7,title:'三国演义'},
					{id:8,title:'史记'},
					{id:9,title:'阿Q正传'},
					{id:10,title:'西游记'}],
			index:2, //默认选中项索引
			id:1, //默认选中项id（优先级高于index）
			onChange:function(item){
				$('.dm_showSelect2').next('i').text(item.id+':'+item.title);
			}
		});
		// 过滤筛选
		$('.dm_filterSelect1').uiSelect({
			data:[{id:1,title:'平凡的世界'},
					{id:2,title:'围城'},
					{id:3,title:'放风筝的人'},
					{id:4,title:'从你的世界走过'},
					{id:5,title:'麻衣神相'},
					{id:6,title:'水浒传'},
					{id:7,title:'三国演义'},
					{id:8,title:'史记'},
					{id:9,title:'阿Q正传'},
					{id:10,title:'西游记'}],
			isFilter:true,//是否允许过滤
			placeholder:'输入关键字过滤'
		});

		// 单选框
		$('.dm_cbox1').uiCheckbox({
			data:[{id:1,title:'男'},
					{id:2,title:'女'},
					{id:3,title:'保密'}],
			index:2, //默认选中项索引
			id:10, //默认选中项id（优先级高于index）
			onChange:function(item){
				$('.dm_cbox1').next('i').text(item.id+':'+item.title);
			}
		});

		// 复选框
		$('.dm_cbox2').uiCheckbox({
			data:[{id:1,title:'金立'},
					{id:2,title:'华为'},
					{id:3,title:'坚果'}],
			index:1, //默认选中项索引
			id:2, //默认选中项id（优先级高于index）
			isMultSelect:true, //是否多选
			onSelect:function(data){
				// 选中/取消某一项时触发，data是当前点击项
				var str=data.state==1?'选中了':'取消选中';
				$('.dm_cbox2').next('i').text(str+'：'+data.item.id+', '+data.item.title);
			}
		});

		
		$('.dm_fgcbox1').uiCheckbox({
			data:[{id:1,title:'男'},
					{id:2,title:'女'}]
		});
		
		// 复选框
		$('.dm_fgcbox2').uiCheckbox({
			data:[{id:1,title:'睡觉'},
					{id:2,title:'发呆'},
					{id:3,title:'超市捏方便面'},
					{id:4,title:'写代码'},
					{id:5,title:'吃'}],
			isMultSelect:true //是否多选
		});
		
		
		$('.dm_fgSelect').uiSelect({
			data:[{id:1,title:'河南'},
					{id:2,title:'山东'},
					{id:3,title:'山西'},
					{id:4,title:'河北'},
					{id:5,title:'湖北'},
					{id:6,title:'上海'}],
			placeholder:'请选择一个省份'
		});


	}
});	