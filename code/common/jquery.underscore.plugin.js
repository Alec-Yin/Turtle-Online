/**
 * zepto和underscore的扩展方法
 * $扩展：
 *     $.fn.cookie cookie操作
 *    
 */
 
 // jquery cookie 扩展
(function ($) {
    var pluses = /\+/g;
    function raw(s) {
        return s;
    }
    function decoded(s) {
        return decodeURIComponent(s.replace(pluses, ' '));
    }
    function converted(s) {
        if (s.indexOf('"') === 0) {
            // This is a quoted cookie as according to RFC2068, unescape
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        }
        try {
            return config.json ? JSON.parse(s) : s;
        } catch (er) { }
    }
    var config = $.cookie = function (key, value, options) {
        // write
        if (value !== undefined) {
            options = $.extend({}, config.defaults, options);

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = config.json ? JSON.stringify(value) : String(value);

            return (document.cookie = [
                config.raw ? key : encodeURIComponent(key),
                '=',
                config.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
                ].join(''));
        }
        // read
        var decode = config.raw ? raw : decoded;
        var cookies = document.cookie.split('; ');
        var result = key ? undefined : {};
        for (var i = 0, l = cookies.length; i < l; i++) {
            var parts = cookies[i].split('=');
            var name = decode(parts.shift());
            var cookie = decode(parts.join('='));

            if (key && key === name) {
                result = converted(cookie);
                break;
            }
            if (!key) {
                result[name] = converted(cookie);
            }
        }
        return result;
    };
    config.defaults = {domain: document.domain};
    $.removeCookie = function (key, options) {
        if ($.cookie(key) !== undefined) {
            // Must not alter options, thus extending a fresh object...
            $.cookie(key, '', $.extend({}, options, { expires: -1 }));
            return true;
        }
        return false;
    };
})(jQuery)

// IE8支持bind
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP = function() {},
      fBound = function() {
        return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
          aArgs.concat(Array.prototype.slice.call(arguments)));
      };
    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();
    return fBound;
  };
}

/***********************************************/
/*****************下面是一些公共方法************/
/***********************************************/

//Array 数组扩展
;(function(Array){
  if(!Array.isArray){
    Array.isArray=function(value){
      return Object.prototype.toString.call(value) == '[object Array]';
    }
  }
  //遍历数组
  //eg:
  // [2, 5, 8, 9].forEach(function(element,index){
  //  '索引' + index + '的值为：' + element
  // });
  if (!Array.prototype.forEach) {
    Array.prototype.forEach = function(callback, thisArg) {
      var T, k;
      if (this == null) {
        throw new TypeError(' this is null or not defined');
      }
      var O = Object(this);
      var len = O.length >>> 0;
      if (typeof callback !== "function") {
        throw new TypeError(callback + ' is not a function');
      }
      if (arguments.length > 1) {
        T = thisArg;
      }
      k = 0;
      while (k < len) {
        var kValue;
        if (k in O) {
          kValue = O[k];
          callback.call(T, kValue, k, O);
        }
        k++;
      }
    };
  }
  //判断元素是否存在
  //eg:
  //[2, 5, 8, 1, 4].some(elem => elem > 10);  // false
  if (!Array.prototype.some) {
    Array.prototype.some = function(fun /*, thisArg*/ ) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.some called on null or undefined');
      }
      if (typeof fun !== 'function') {
        throw new TypeError();
      }
      var t = Object(this);
      var len = t.length >>> 0;
      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++) {
        if (i in t && fun.call(thisArg, t[i], i, t)) {
          return true;
        }
      }
      return false;
    };
  }

  // 检查数组中每个元素是否都符合条件
  // eg:
  // [12, 5, 8, 130, 44].every(elem => elem >= 10); // false
  // [12, 54, 18, 130, 44].every(elem => elem >= 10); // true
  if (!Array.prototype.every) {
    Array.prototype.every = function(callbackfn, thisArg) {
      'use strict';
      var T, k;
      if (this == null) {
        throw new TypeError('this is null or not defined');
      }
      var O = Object(this);
      var len = O.length >>> 0;
      if (typeof callbackfn !== 'function') {
        throw new TypeError();
      }
      if (arguments.length > 1) {
        T = thisArg;
      }
      k = 0;
      while (k < len) {
        var kValue;
        if (k in O) {
          kValue = O[k];
          var testResult = callbackfn.call(T, kValue, k, O);
          if (!testResult) {
            return false;
          }
        }
        k++;
      }
      return true;
    };
  }

  //从左到右对数组的每个元素执行相应操作(可用于计算数组总和，或者合并多个数组)
  // eg:
  // [0,1,2,3,4].reduce(function(a,b){return a+b;});//返回0+1+2+3+4=10
  // [0,1,2,3,4].reduce(function(a,b){return a+b;},10);//返回10+(0+1+2+3+4)=20
  // [[0, 1], [2, 3], [4, 5]].reduce(function(a, b) {return a.concat(b);});//[0, 1, 2, 3, 4, 5]
  if (!Array.prototype.reduce) {
    Array.prototype.reduce = function(callback /*, initialValue*/ ) {
      'use strict';
      if (this == null) {
        throw new TypeError('Array.prototype.reduce called on null or undefined');
      }
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      var t = Object(this),
        len = t.length >>> 0,
        k = 0,
        value;
      if (arguments.length == 2) {
        value = arguments[1];
      } else {
        while (k < len && !k in t) {
          k++;
        }
        if (k >= len) {
          throw new TypeError('Reduce of empty array with no initial value');
        }
        value = t[k++];
      }
      for (; k < len; k++) {
        if (k in t) {
          value = callback(value, t[k], k, t);
        }
      }
      return value;
    };
  }

  //从右到左对数组的每个元素执行相应操作(可用于计算数组总和，或者合并多个数组)
  // eg:
  // [0,1,2,3,4].reduceRight(function(a,b){return a+b;});//返回4+3+2+1+0=10
  // [0,1,2,3,4].reduceRight(function(a,b){return a+b;},10);//返回10+(4+3+2+1+0)=20
  // [[0, 1], [2, 3], [4, 5]].reduceRight(function(a, b) {return a.concat(b);});//[5, 4, 3, 2, 1, 0]
  if ('function' !== typeof Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function(callback /*, initialValue*/ ) {
      'use strict';
      if (null === this || 'undefined' === typeof this) {
        throw new TypeError('Array.prototype.reduce called on null or undefined');
      }
      if ('function' !== typeof callback) {
        throw new TypeError(callback + ' is not a function');
      }
      var t = Object(this),
        len = t.length >>> 0,
        k = len - 1,
        value;
      if (arguments.length >= 2) {
        value = arguments[1];
      } else {
        while (k >= 0 && !k in t) {
          k--;
        }
        if (k < 0) {
          throw new TypeError('Reduce of empty array with no initial value');
        }
        value = t[k--];
      }
      for (; k >= 0; k--) {
        if (k in t) {
          value = callback(value, t[k], k, t);
        }
      }
      return value;
    };
  }

  //把一个数组分割为新的数组块（可用于对reduce方法中合并多个数组的可逆操作）
  // eg:
  // [1,5,6,3,7,8].chunk(2); //[1,5] [6,3] [7,8]
  Array.prototype.chunk = function(n) {
    for (var i = 0, temp = [], l = ~~this.length / n; temp.length < l; temp[i++] = this.splice(0, n));
    return temp;
  }

  //返回数组中第一个匹配项的索引值，没有则返回-1
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
      var k;
      // 1. Let O be the result of calling ToObject passing
      //    the this value as the argument.
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var O = Object(this);
      // 2. Let lenValue be the result of calling the Get
      //    internal method of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      var len = O.length >>> 0;
      // 4. If len is 0, return -1.
      if (len === 0) {
        return -1;
      }
      // 5. If argument fromIndex was passed let n be
      //    ToInteger(fromIndex); else let n be 0.
      var n = +fromIndex || 0;
      if (Math.abs(n) === Infinity) {
        n = 0;
      }
      // 6. If n >= len, return -1.
      if (n >= len) {
        return -1;
      }
      // 7. If n >= 0, then Let k be n.
      // 8. Else, n<0, Let k be len - abs(n).
      //    If k is less than 0, then let k be 0.
      k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      // 9. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the
        //    HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        //    i.  Let elementK be the result of calling the Get
        //        internal method of O with the argument ToString(k).
        //   ii.  Let same be the result of applying the
        //        Strict Equality Comparison Algorithm to
        //        searchElement and elementK.
        //  iii.  If same is true, return k.
        if (k in O && O[k] === searchElement) {
          return k;
        }
        k++;
      }
      return -1;
    };
  }

  //返回数组中最后一个匹配项的索引值，没有则返回-1
  if (!Array.prototype.lastIndexOf) {
    Array.prototype.lastIndexOf = function(searchElement /*, fromIndex*/ ) {
      'use strict';
      if (this === void 0 || this === null) {
        throw new TypeError();
      }
      var n, k,
        t = Object(this),
        len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      n = len - 1;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) {
          n = 0;
        } else if (n != 0 && n != (1 / 0) && n != -(1 / 0)) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      for (k = n >= 0 ? Math.min(n, len - 1) : len - Math.abs(n); k >= 0; k--) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }

  //按照指定规则，把数组中的元素映射成新值，生成新的数组，原数组不变
  // eg：
  // [1, 4, 9].map(Math.sqrt);// roots is now [1, 2, 3], numbers is still [1, 4, 9]
  // ['1', '2', '3'].map(parseInt);//[1,2,3] 字符串数组变成数字数组
  // [{name: "张含韵", "email": "zhang@email.com"},{name: "江一燕",   "email": "jiang@email.com"},{name: "李小璐",  "email": "li@email.com"}
  // ].map(function (user) { return user.email; }).join(", "); // zhang@email.com, jiang@email.com, li@email.com

  if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {
      var T, A, k;
      if (this == null) {
        throw new TypeError(' this is null or not defined');
      }
      var O = Object(this);
      var len = O.length >>> 0;
      if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
      }
      if (arguments.length > 1) {
        T = thisArg;
      }
      A = new Array(len);
      k = 0;
      while (k < len) {
        var kValue, mappedValue;
        if (k in O) {
          kValue = O[k];
          mappedValue = callback.call(T, kValue, k, O);
          A[k] = mappedValue;
        }
        k++;
      }
      return A;
    };
  }

  //根据条件查询数组，返回满足条件的项
  // [1,2,3,4].filter(function(item){return item>2;}) //[3, 4]
  if (!Array.prototype.filter) {
    Array.prototype.filter = function(fun /*, thisArg*/ ) {
      'use strict';

      if (this === void 0 || this === null) {
        throw new TypeError();
      }

      var t = Object(this);
      var len = t.length >>> 0;
      if (typeof fun !== 'function') {
        throw new TypeError();
      }

      var res = [];
      var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
      for (var i = 0; i < len; i++) {
        if (i in t) {
          var val = t[i];

          // NOTE: Technically this should Object.defineProperty at
          //       the next index, as push can be affected by
          //       properties on Object.prototype and Array.prototype.
          //       But that method's new, and collisions should be
          //       rare, so use the more-compatible alternative.
          if (fun.call(thisArg, val, i, t)) {
            res.push(val);
          }
        }
      }

      return res;
    };
  }
  // 数组正序排列
  Array.prototype.sortAsc=function(fun){
    if (this === void 0 || this === null) {
      throw new TypeError();
    }     
    if (typeof fun !== 'function') {
      throw new TypeError();
    }
    fun=fun||function(item1,item2){return item1>item2;};
    return Array.prototype.sort.call(this,fun);
  }
  // 数组倒序排列
  Array.prototype.sortDesc=function(fun){
    if (this === void 0 || this === null) {
      throw new TypeError();
    }     
    if (typeof fun !== 'function') {
      throw new TypeError();
    }
    fun=fun||function(item1,item2){return item1<item2;};
    return Array.prototype.sort.call(this,fun);
  }
  /**
       * get the first item of the array
       * @param  {Function} fn  the condition function used for matching the first item
       * @return {[type]}       the first item
       */
      Array.prototype.first = function (fn) {
          if(typeof fn !== 'function') return this[0];
          for (var i = 0, l = this.length; i < l; i++) {
              if(fn(this[i], i)) return this[i];
          };
          return undefined;
      }
      /**
       * get the last item of the array
       * @param  {Function} fn  the condition function used for matching the last item
       * @return {[type]}       the last item
       */
      Array.prototype.last = function (fn) {
          if(typeof fn !== 'function')
              return this.length ? this[this.length-1] : undefined;
          for (var i = this.length - 1; i >= 0; i--) {
              if(fn(this[i], i)) return this[i];
          };
          return undefined;
      }   
})(Array)

// object 对象方法定义
;(function(Object) {
  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
  if (!Object.keys) {
    Object.keys = (function () {
      'use strict';
      var hasOwnProperty = Object.prototype.hasOwnProperty,
          hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
          dontEnums = [
            'toString',
            'toLocaleString',
            'valueOf',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'constructor'
          ],
          dontEnumsLength = dontEnums.length;

      return function (obj) {
        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
          throw new TypeError('Object.keys called on non-object');
        }

        var result = [], prop, i;

        for (prop in obj) {
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }

        if (hasDontEnumBug) {
          for (i = 0; i < dontEnumsLength; i++) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
          }
        }
        return result;
      };
    }());
  }

  // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
  if (typeof Object.create != 'function') {
    Object.create = (function() {
      var Temp = function() {};
      return function (prototype) {
        if (arguments.length > 1) {
          throw Error('Second argument not supported');
        }
        if (typeof prototype != 'object') {
          throw TypeError('Argument must be an object');
        }
        Temp.prototype = prototype;
        var result = new Temp();
        Temp.prototype = null;
        return result;
      };
    })();
  }      
})(Object)