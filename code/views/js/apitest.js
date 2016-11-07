/**
 * 测试API
 */
define(['cPageView','text!views/temple/temptest.html'],function(PageView,temptest) {
	var View = PageView.extend({
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