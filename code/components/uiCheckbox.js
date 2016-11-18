// 下拉选项
;(function($) {
	var myRadio =function(wrapper,options){
		options = options || {};
		this.options = $.extend({
			data: [],
			id: null,
			index: null,
			isMultSelect:false,
			onSelect:function(){},//多选选中时触发
			onChange:function(){} //单选改变时触发
		}, options);
		this.wrapper = wrapper;
		this.beforeIndex=this.options.id ? null : this.options.index;
		this.isMultSelect = this.options.isMultSelect;
		this.checkIcon = this.isMultSelect ? '&#xe6d6;' : '&#xe75b;';
		this.unCheckIcon = this.isMultSelect ? '&#xe6d5;' : '&#xe6d7;';
		this.init();
	}

	myRadio.prototype = {
		init:function(){
			this.wrapper.empty();
			this.wrapper.html(this.getHtml());
			this.bindEvents();
		},
		getHtml:function(){
			// 设置默认值
			var defaultData = {
				id:'',
				title:''
			};
			if(this.options.id){
				defaultData = _.findWhere(this.options.data,{id:+this.options.id})||_.findWhere(this.options.data,{id:this.options.id.toString()}) || defaultData;
			}else if(this.options.index){
				defaultData = this.options.data && this.options.data[this.options.index] || defaultData;
			}
			this.wrapper.attr('value', defaultData.id).attr('title', defaultData.title);
			var html ='';
			this.options.data.map(function(item){
				if(item.id==defaultData.id){
					html+='<span value="'+item.id+'" class="checked"><i class="ttlofont ttl-anim">'+this.checkIcon+'</i><em>'+item.title+'</em></span>';
				}else{
					html+='<span value="'+item.id+'"><i value="'+item.id+'" class="ttlofont ttl-anim">'+this.unCheckIcon+'</i><em>'+item.title+'</em></span>';
				}
			}.bind(this))
			return html;
		},
		selectItem:function($tar){
			var selData = {
				id: $tar.attr('value'),
				title: $tar.find('em').text()
			};
			this.wrapper.attr('value', selData.id).attr('title', selData.title);
			$tar.addClass('checked').siblings().removeClass('checked');

			$tar.find('i').html(this.checkIcon).addClass('ttl-anim-scaleSpring');
			$tar.siblings().find('i').html(this.unCheckIcon).removeClass('ttl-anim-scaleSpring');
			var nowIndex = this.wrapper.find('span').index($tar);
			if (this.beforeIndex != nowIndex) {
				this.beforeIndex = nowIndex;
				this.options.onChange(selData);
			}
		},
		selectItemMult:function($tar){
			var param ={
				state:null,
				item:{
					id: $tar.attr('value'),
					title: $tar.find('em').text()
				}
			}
			if($tar.hasClass('checked')){
				// 取消选择
				$tar.removeClass('checked');
				$tar.find('i').html(this.unCheckIcon).removeClass('ttl-anim-scaleSpring');			
				param.state=0;
			}else{
				// 选择
				$tar.addClass('checked');
				$tar.find('i').html(this.checkIcon).addClass('ttl-anim-scaleSpring');	
				param.state=1;
			}
			var valueList=[],titleList=[];
			this.wrapper.find('span').map(function(ix,item){
				var $item = $(item);
				if($item.hasClass('checked')){
					valueList.push($item.attr('value'));
					titleList.push($item.find('em').text());
				}
			});
			this.wrapper.attr('value', valueList.join(',')).attr('title', titleList.join(','));
			this.options.onSelect(param);

		},
		bindEvents:function(){
			this.wrapper.bind('click',function(e){
				var $tar = $(e.target || e.srcElement);
				if($tar.closest('span').length){
					if(this.isMultSelect){
						this.selectItemMult($tar.closest('span'));
					}else{
						this.selectItem($tar.closest('span'));					
					}
				}
			}.bind(this));
		}
	}

	$.fn.uiCheckbox = function(options) {
		new myRadio(this, options);
	};
})(jQuery)