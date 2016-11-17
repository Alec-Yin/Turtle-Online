// 下拉选项
;(function($) {
	var mySelect =function(wrapper,options){
		options = options || {};
		this.options = $.extend({
			data: [],
			id: null,
			index: null,
			isFilter: false,
			onChange:function(){}
		}, options);
		this.wrapper = wrapper;
		this.beforeIndex = this.options.id ? null : this.options.index;
		this.isInput = this.options.isFilter ? true : false;
		this.placeholder = this.options.placeholder||"";
		this.maxHeight =300;//css里写死的最大高度300px
		this.init();
	}

	mySelect.prototype = {
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
			var readonlyStr = this.isInput ? '' : 'readonly';
			var editStr = this.isInput ? ' isedit' : '';
			var html = '<div class="ttl-select-title">'+
						'<input type="text" placeholder="'+this.placeholder+'" '+readonlyStr+' value="'+defaultData.title+'" class="ttl-input'+editStr+'" autocomplete="off">'+
						'<i class="ttl-edge"></i>'+
					'</div>';
			html+='<dl class="ttl-anim ttl-anim-upbit">';
			this.options.data.map(function(item){
				if(item.id==defaultData.id){
					html+='<dd value="'+item.id+'" class="selected">'+item.title+'</dd>';
				}else{
					html+='<dd value="'+item.id+'">'+item.title+'</dd>';
				}
			})
			html+='</dl>';
			return html;
		},
		show:function(){
			this.wrapper.find('.ttl-select-title').addClass('ttl-showOpts');
			this.wrapper.find('dl').show();
		},
		hide:function(){
			this.wrapper.find('dl').hide();
			this.wrapper.find('.ttl-select-title').removeClass('ttl-showOpts');
		},
		selectItem:function($tar){
			var selData = {
				id: $tar.attr('value'),
				title: $tar.text()
			};
			this.wrapper.attr('value', selData.id).attr('title', selData.title);
			this.wrapper.find('input').val(selData.title);
			this.hide();
			$tar.addClass('selected').siblings().removeClass('selected');
			var nowIndex = this.wrapper.find('dl dd').index($tar);
			if (this.beforeIndex != nowIndex) {
				this.beforeIndex = nowIndex;
				this.options.onChange(selData);
			}
		},
		_fixScroll: function() {
			var $dl=this.wrapper.find('dl');
			if ($dl.is(':hidden')) return;
			var item = $dl.find('dd.selected');
			if (!item.length) return;
			var offsetTop,
				upperBound,
				lowerBound,
				heightDelta = item.outerHeight();
			offsetTop = item[0].offsetTop;
			upperBound = $dl.scrollTop();
			lowerBound = upperBound + this.maxHeight - heightDelta;
			if (offsetTop < upperBound) {
				$dl.scrollTop(offsetTop);
			} else if (offsetTop > lowerBound) {
				$dl.scrollTop(offsetTop - this.maxHeight + heightDelta);
			}
		},
		// 向上向下选中
		_move: function(dir){
			var items = this.wrapper.find('dl dd'),
				current = items.filter('.selected'),
				index = current.prevAll('dd').length,
				total = items.length;
			switch(dir){
				case 'up':
					index--;
					(index < 0) && (index = (total - 1));
					break;
				case 'down':							
					index++;
					(index >= total) && (index = 0);							
					break;
			}
			items.eq(index).addClass('selected').siblings().removeClass('selected');
			this._fixScroll();
		},
		bindEvents:function(){
			this.wrapper.bind('click',function(e){
				var $tar = $(e.target || e.srcElement);
				if($tar.closest('.ttl-select-title').length){
					// 显示下拉项
					if(this.wrapper.find('input.isedit').length){
						var selectData = {
							id: this.wrapper.attr('value'),
							title: this.wrapper.attr('title')
						};
						var html='';
						this.options.data.map(function(item) {
							if (item.id == selectData.id) {
								html += '<dd value="' + item.id + '" class="selected">' + item.title + '</dd>';
							} else {
								html += '<dd value="' + item.id + '">' + item.title + '</dd>';
							}
						});
				 		this.wrapper.find('dl').html(html);
					}
					this.show();
				}else if($tar.is('dd')){
					// 选中下拉项
					this.selectItem($tar);
				}
			}.bind(this));

			// 值改变时触发
			this.wrapper.find('input.isedit').bind('input propertychange',function(){
				var keyStr = this.wrapper.find('input.isedit').val().trim();
				var selectData = {
					id: this.wrapper.attr('value'),
					title: this.wrapper.attr('title')
				};
				var html='';
				this.options.data.map(function(item){
					if (item.title.indexOf(keyStr) > -1) {
						if (item.id == selectData.id) {
							html += '<dd value="' + item.id + '" class="selected">' + item.title + '</dd>';
						} else {
							html += '<dd value="' + item.id + '">' + item.title + '</dd>';
						}
					}
				});
				this.wrapper.find('dl').html(html);				
				this.show();
			}.bind(this));

			
			// 绑定键盘按下事件 (仅限可输入过滤下拉框) 
			this.wrapper.find('input.isedit').length && 
			this.wrapper.bind('keydown',function(e) {
				switch (e.which) {
					case 13:
						// 回车
						this.selectItem(this.wrapper.find('dl dd.selected'));
						break;
					case 38:
						// up
						this._move('up');
						break;
					case 40:
						// down
						this._move('down');
						break;

					default:
						break;
				}
			}.bind(this));

			// 点击其他部分，隐藏下拉项
			$(document).bind('mouseup', function(e) {
				var $tar = $(e.target || e.srcElement);
				if($tar[0]!=this.wrapper.find('dl')[0]){
					var box = this.wrapper.find('dl');
					if (box && !box.is(":hidden")) {
						this.hide();
					}
				}
			}.bind(this));
		}
	}

	$.fn.uiSelect = function(options) {
		new mySelect(this, options);
	};
})(jQuery)