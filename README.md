#turtle-online
Turtle online 是Turtle框架的PC前端架构，包括组件和API两大部分，可以快速的搭建PC前端开发环境。
组件包括日历、分页、图片轮播/图片浏览、各类提示弹框/自定义弹层、气泡提示等。
API包括常用JS方法封装（cookie操作、ajax封装、日期处理、浏览器判断、当前位置获取页面跳转、其他常用方法等）、基于Backbone.View/Require.text.js的框架、前端模板。
重要说明：Turtle online组件部分使用了第三方js库 [layerUI](http://layer.layui.com)、[poshytip](http://vadikom.com/tools/poshy-tip-jquery-plugin-for-stylish-tooltips)。

##演示
使用github自带预览功能，速度稍慢，请耐心等待。部分功能因url原因无法访问，请按照下面【二、运行Turtle online】的说明操作，体验更好效果。

[Turtle Online](http://htmlpreview.github.com/?https://github.com/Alec-Yin/Turtle-Online/blob/master/code/views/index.html)

##一、使用方法
	1. 把build目录放到你项目中；
	2. 在页面中引入Turtle.min.css和../build/Turtle.min.js；
	3. 然后就可以在你的js中使用了，实例如下：
		
		// 语法参考 requireJS、BackboneJs
		// cPageView：是Turtle封装的Backbone.View.js，text!是在turtle中已经引入的require.text.js。
		define(['cPageView','text!views/temple/temptest.html'],function(cPageView,temptest) {
			var View = cPageView.extend({
				events:{
					'click #cpageviewTest1':'clicktest1',
					'click #templateA':'clicktest2'
				},
				initialize: function () {
					console.log('initialize');
					this.$el.find('#cpageviewTest3').html('默认值被改变');
					this.on('initpage',function(){
						console.log('initpage');
					});
					this.trigger('initpage');
				},
				clicktest1:function(e){
					this.$el.find('#cpageviewTest2').html('赋值成功！'+new Date())
				},
				clicktest2:function(){
					$('#templateTest').html(_.template(temptest)({name:'Alec yin'}));
				}
			})
			return new View();
		});

	4. API的使用，全部都是在Turtle/turtle对象中，直接【Turtle./turtle.】就可以了。
	以上四步你就可以使用Turtle online中的方法了，如果你没有使用requireJs的话，API和组件也是可以直接使用的。

##二、运行Turtle online
	1. 下载Turtle online项目，直接点击index.html即可查看。
		（此时有js报错，因为使用了require.js，需要提供项目路径，不影响查看非cPageView实例以外的实例。）
	
	如果你要看cPageView的实例代码，请继续操作：
	2. 把turtle online代码部署到服务器上；
	3. 修改index.html中的代码【baseUrl: "http://localhost/TurtleOnline",】改成你的部署路径；
	4. 再次运行index.html即可。

##三、二次开发说明
	如果现有的Turtle online无法满足你的需求，你可以在现有代码的基础上定制型开发（注意：请勿提交至代码库，仅自己使用，谢谢！）。
	开发步骤：
		1. 修改代码；
		2. 如果新增或者删除了文件，需要同步修改gulp配置文件gulpfile.js；
		3. 安装node_modules依赖包；
		4. 执行gulp build命令，合并压缩项目至build目录。
		5. 把build目录下文件拷贝你项目中就可以直接使用了。

##四、项目架构说明
![项目架构说明](https://git.oschina.net/yinluhui/Pictures/raw/master/TurtleOnline/1.png)

##五、Turtle Online框架运行图
![Turtle Online框架运行图](https://git.oschina.net/yinluhui/Pictures/raw/master/TurtleOnline/2.png)
![Turtle Online框架运行图](https://git.oschina.net/yinluhui/Pictures/raw/master/TurtleOnline/3.png)
![Turtle Online框架运行图](https://git.oschina.net/yinluhui/Pictures/raw/master/TurtleOnline/4.png)
![Turtle Online框架运行图](https://git.oschina.net/yinluhui/Pictures/raw/master/TurtleOnline/5.png)
![Turtle Online框架运行图](https://git.oschina.net/yinluhui/Pictures/raw/master/TurtleOnline/6.png)
![Turtle Online框架运行图](https://git.oschina.net/yinluhui/Pictures/raw/master/TurtleOnline/7.png)
	
	
