/**
 * 为页面级js提供基类
 * 继承Backbone.View
 */
define(function() {
	var pageView = Backbone.View.extend({
     	el: $('body')
    });

	return pageView;
});