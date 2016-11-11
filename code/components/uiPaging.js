//分页
;(function($){
  var mypage = {
    init:function(wrapper,options){
      this.wrapper=wrapper;
      this.wrapper.empty();
      this.options=options;
      this.wrapper.append(this.fillHtml());
      this.bindEvent();
    },
    fillHtml:function(){
      var pageTotal=this.options.pageTotal, 
          pageIndex=this.options.pageIndex,
          pageSize=this.options.pageSize;

        var pages = Math.floor(pageTotal / pageSize);
        if (pageTotal % pageSize != 0) {
            pages += 1;
        }
        if (pages == 0)
            pages++;

        var sb = "";
        var spn = pageIndex - 1;
        if (spn + 3 > pages)
            spn = pages - 3;
        if (spn < 0)
            spn = 0;
        var n = spn + 3;
        if (pages < 4)
            n = pages;
        sb += "<ul class='c_page'>";
        sb += Turtle.stringFormat("<li toPageIndex='$1'>上一页</li>", pageIndex == 0 ? "" : pageIndex - 1);

        if (pageIndex > 1 && spn > 0) {
            sb += Turtle.stringFormat("<li class='$3' toPageIndex='$2'>$1</li>", 1, 0 == pageIndex ? "" : 0, 0 == pageIndex ? "select" : "");
        }
        if (pageIndex > 2) {
            sb += Turtle.stringFormat("<b>...</b>");
        }

        for (var i = spn; i < n; i++) {
            sb += Turtle.stringFormat("<li class='$3' toPageIndex='$2'>$1</li>", i + 1, i == pageIndex ? "" : i, i == pageIndex ? "select" : "");
        }
        if (pages > 4 && pageIndex + 1 < pages - 2) {
            sb += Turtle.stringFormat("<b>...</b>");
        }
        if (pages > 3 && pageIndex + 1 < pages - 1) {
            sb += Turtle.stringFormat("<li class='$3' toPageIndex='$2'>$1</li>", pages, pages - 1 == pageIndex ? "" : pages - 1, pages - 1 == pageIndex ? "select" : "");
        }
        sb += Turtle.stringFormat("<li toPageIndex='$1'>下一页</li>", pageIndex == pages - 1 ? "" : pageIndex + 1);

        if(this.options.isShowTotal){
          sb += Turtle.stringFormat("<b class='total'>共$1页</b>", pages);
        }

        if(this.options.isInputPageIndex){
          sb += Turtle.stringFormat("到第<input id='txtPageNum' type='number' min='1' max='$1' value=''>页", pages);
          sb += "<button>确定</button>";
        }

        sb += Turtle.stringFormat("</ul>");
        return sb;
    },
    bindEvent:function(){
      this.wrapper.on("click","li",function(tar){
        var pageIndex=$(this).attr('toPageIndex');
        if(pageIndex){
          mypage.OnPageChange(pageIndex);
        }
      })

      this.wrapper.on("click","button",function(){
          mypage.OnPageChange('-1','jumpPage');
      })

      this.wrapper.on("keyup","input#txtPageNum",function(){
        var pages=$(this).attr('max');
        pages = +pages;
        var num = +$(this).val();
        if (num > pages) {
            $(this).val(num.toString().substring(0, num.toString().length - 1));
        }
      })
    },
    OnPageChange: function(pageIndex, mark) {
        pageIndex = +pageIndex + 1;
        if (mark == "jumpPage") {
            pageIndex = $('#txtPageNum').val();
        }
        if (pageIndex) {
          // 如果没有onPageClick，则点击分页刷新当前页面
          if(this.options.onPageClick){
            this.options.onPageClick(pageIndex);
          }else{
            var location = document.location,
                url = location.href;
            if (/pageIndex=/.test(url)) {
                url = url.replace(/pageIndex=\d+/, 'pageIndex=' + pageIndex);
            } else {
              if(location.search)
                url = url.replace(location.hash,'') + '&pageIndex=' + pageIndex + location.hash;
              else
                url = url.replace(location.hash,'') + '?pageIndex=' + pageIndex;
            }
            document.location.href = url;
          }
        }
    }
  };
  $.fn.createPage = function(options){
    options=options||{};
    // pageTotal 总条数
    // pageIndex 当前页索引
    // pageSize 每页显示条数，默认12条
    // isInputPageIndex 是否允许输入跳转页索引
    // isShowTotal 是否显示做条数
    var args = $.extend({
      pageTotal:0, 
      pageIndex:0,
      pageSize:12,
      isInputPageIndex:false,
      isShowTotal:false
    },options);
    mypage.init(this,args);
  }
})(jQuery)