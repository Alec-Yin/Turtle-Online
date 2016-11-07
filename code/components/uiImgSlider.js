/**
 * slider插件可悬停控制
 */
; $(function ($) {
    var Slider = function (container, options) {
        /*
        options = {
            auto: true,
            time: 3000,
            event: 'hover' | 'click',
            mode: 'slide | fade',
            controller: $(),
            activeControllerCls: 'className',
            exchangeEnd: $.noop
        }
        */
        if (!container) return;
        var options = options || {},
            currentIndex = 0,
            cls = options.activeControllerCls,
            delay = options.delay,
            isAuto = options.auto,
            controller = options.controller,
            event = options.event,
            interval,
            slidesWrapper = container.children().first(),
            slides = slidesWrapper.children(),
            length = slides.length,
            childWidth = container.width(),
            totalWidth = childWidth * slides.length;

        function init() {
            var controlItem = controller.children();
            mode();
            event == 'hover' ? controlItem.mouseover(function () {
                stop();
                var index = $(this).index();
                play(index, options.mode);
            }).mouseout(function () {
                isAuto && autoPlay();
            }) : controlItem.click(function () {
                stop();
                var index = $(this).index();

                play(index, options.mode);
                isAuto && autoPlay();
            });
            isAuto && autoPlay();
        }
        //animate mode
        function mode() {
            var wrapper = container.children().first();
            options.mode == 'slide' ? wrapper.width(totalWidth) : wrapper.children().css({
                'position': 'absolute',
                'left': 0,
                'top': 0
            }).first().siblings().hide();
        }
        //auto play
        function autoPlay() {
            interval = setInterval(function () {
                triggerPlay(currentIndex);
            }, options.time);
        }
        //trigger play
        function triggerPlay(cIndex) {
            var index;
            (cIndex == length - 1) ? index = 0 : index = cIndex + 1;
            play(index, options.mode);
        }
        //play
        function play(index, mode) {
            slidesWrapper.stop(true, true);
            slides.stop(true, true);
            mode == 'slide' ? (function () {
                if (index > currentIndex) {
                    slidesWrapper.animate({
                        left: '-=' + Math.abs(index - currentIndex) * childWidth + 'px'
                    }, delay);
                } else if (index < currentIndex) {
                    slidesWrapper.animate({
                        left: '+=' + Math.abs(index - currentIndex) * childWidth + 'px'
                    }, delay);
                } else {
                    return;
                }
            })() : (function () {
                if (slidesWrapper.children(':visible').index() == index) return;
                slidesWrapper.children().fadeOut(delay).eq(index).fadeIn(delay);
            })();
            try {
                controller.children('.' + cls).removeClass(cls);
                controller.children().eq(index).addClass(cls);
            } catch (e) { }
            currentIndex = index;
            options.exchangeEnd && typeof options.exchangeEnd == 'function' && options.exchangeEnd.call(this, currentIndex);
        }
        //stop
        function stop() {
            clearInterval(interval);
        }
        //prev frame
        function prev() {
            stop();
            currentIndex == 0 ? triggerPlay(length - 2) : triggerPlay(currentIndex - 2);
            isAuto && autoPlay();
        }
        //next frame
        function next() {
            stop();
            currentIndex == length - 1 ? triggerPlay(-1) : triggerPlay(currentIndex);
            isAuto && autoPlay();
        }
        //init
        init();
        //expose the Slider API
        return {
            prev: function () {
                prev();
            },
            next: function () {
                next();
            }
        }
    };
    $.fn.createImgSlider = function(options){
      options.imgList=options.imgList||[];
      this.html('<div class="c_imgslider">\
                    <ul class="slides">\
                    </ul>\
                    <ul class="flex-direction-nav">\
                      <li><a class="flex-prev" href="javascript:;">Previous</a></li>\
                      <li><a class="flex-next" href="javascript:;">Next</a></li>\
                    </ul>\
                    <ol class="flex-control-nav flex-control-paging">\
                    </ol>\
                  </div>');
      var $slider = this.find('.c_imgslider');
      options.imgList.map(function(img,index){
        $slider.find('.slides').append('<li>\
            <a title="" target="_blank" href="#">\
              <img alt="" style="background: url('+img.url+') no-repeat center;" src="'+img.url+'">\
            </a>\
          </li>');
        $slider.find('.flex-control-nav').append('<li><a>'+(index+1)+'</a></li>');
      });

      var bannerSlider = new Slider($slider, {
        time: 5000,
        delay: 400,
        event: 'hover',
        auto: true,
        mode: 'fade',
        controller: this.find('.flex-control-nav'),
        activeControllerCls: 'active'
      });
      this.find('.c_imgslider .flex-prev').click(function() {
        bannerSlider.prev()
      });
      this.find('.c_imgslider .flex-next').click(function() {
        bannerSlider.next()
      });
      return bannerSlider;
    }
}(jQuery));