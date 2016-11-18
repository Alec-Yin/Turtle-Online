// (function() {
// 	window.Turtle || (window.Turtle = {});
// 	_.extend(Turtle, {
// 		alert: Turtle.layer.alert,
// 		msg: Turtle.layer.msg,
// 		confirm: Turtle.layer.confirm,
// 		showLoading: function(icon, options) {
// 			options=options||{};
// 			if(!options.shade){
// 				options.shade=0.3;
// 			}
// 			return Turtle.layer.load(icon, options);
// 		},
// 		hideLoading: function(loadIndex) {
// 			// 如果不指定关闭具体哪一个加载框，则关闭所有
// 			if (loadIndex)
// 				return Turtle.layer.close(loadIndex);
// 			else
// 				return Turtle.layer.closeAll('loading');
// 		},
		
// 	});
// })()



// 对常用组件的二次封装，便于调用
define('_tUIViewUtil',function() {
	function fun() {
			this.initialize();
	}
	fun.prototype = {
		initialize: function() {},
		interface: function() {
			return {
				'alert': Turtle.layer.alert,
				'msg': Turtle.layer.msg,
				'confirm': Turtle.layer.confirm,
				'showLoading': this.showLoading,
				'hideLoading': this.hideLoading
			}
		},		
		showLoading: function(icon, options) {
			options = options || {};
			if (!options.shade) {
				options.shade = 0.3;
			}
			return Turtle.layer.load(icon, options);
		},
		hideLoading: function(loadIndex) {
			// 如果不指定关闭具体哪一个加载框，则关闭所有
			if (loadIndex)
				return Turtle.layer.close(loadIndex);
			else
				return Turtle.layer.closeAll('loading');
		}
	}
	return new fun();
});

// 提供页面级的方法和组件封装，比如头部、底部、中间内容、页面跳转/回退方法等
define('_tPageUtil',function(){
	function fun(){
		this.initialize();
	}
	fun.prototype={
		initialize:function(){
		},
		interface:function(){
			return{
				goBack:this.goBack,
				goTo:this.goTo
			}
		},
		goBack:function(url,opt){
			if (arguments.length === 0) {
				history.back();
			} else {
				this.goTo.apply(this, arguments);
			}
		},
		goTo:function(url,opt){
			window.location.href=url;
		}
	}
	return new fun();
});

// 本地缓存:cookie storage
define('_tCookieStorage',function(){
	function fun(){
		this.initialize();
	}
	fun.prototype = {
		initialize: function() {},
		interface: function() {
			return {
				setCookie: this.setCookie,
				getCookie: this.getCookie,
				removeCookie: this.removeCookie,
				setStorage: this.setStorage,
				getStorage: this.getStorage
			}
		},
		setCookie: function(key, value, expires, domain) {
			expires = expires || 30;
			 $.cookie(key, value, {
				expires: expires,
				path: '/',
				domain: domain || document.domain
			});
		},
		//获取cookie
		getCookie: function(key) {
			var value = $.cookie(key);
			if (Turtle.isNullValue(value))
				return null;
			else
				return value;
		},
		//删除cookie
		removeCookie: function(key) {
			$.removeCookie(key, {
		      path: "/"
		    });
		},
		//设置本地缓存
		setStorage: function(key, value, time) {
			time = time || 0;
			window.localStorage.setItem(key, value);
			if (time > 0) {
				key += "_Time";
				var tv = (new Date().getTime() + time * 60 * 1000).toString() + "_" + time.toString();
				window.localStorage.setItem(key, tv);
			}
		},
		//获取本地缓存
		getStorage: function(key) {
			var value = window.localStorage.getItem(key);
			var tkey = key + "_Time";
			var tvs = window.localStorage.getItem(tkey);
			if (!Turtle.isNullValue(tvs)) {
				var vs = tvs.split("_");
				var tv = parseFloat(vs[0]);
				var time = parseFloat(vs[1]);
				if (tv > 0) {
					var ct = new Date().getTime();
					if (ct > tv) {
						value = "";
						window.localStorage.removeItem(key);
						window.localStorage.removeItem(tkey);
					} else {
						tv = (new Date().getTime() + time * 60 * 1000).toString() + "_" + time.toString();
						window.localStorage.setItem(tkey, tv);
					}
				}
			}
			return Turtle.isNullValue(value) ? "" : value;
		}
	}
	return new fun();
});

// 时间处理
define('_tDateUtil', function() {
	function fun() {
		this.initialize();
	}
	fun.prototype = {
		initialize: function() {},
		interface: function() {
			return {
				dateUtil: this.dateUtil
			}
		},
		/**
		 * 静态日期操作类，封装系列日期操作方法.
		 * @namespace
		 */
		dateUtil: function() {
			/**
			 * Date日期的扩展方法
			 */
			_.extend(Date.prototype, {
				/**
				 * @method addYears
				 * 加上特定的年份
				 * @param {integer} 需要加上的特定年份
				 * @return {object} 返回加好年份的日期对象
				 */
				addYears: function(y) {
					var d = new Date(+this);
					d.setYear(d.getFullYear() + y);
					return d;
				},

				/**
				 * @method addMonths
				 * 加上特定的月份
				 * @param {integer} 需要加上的特定月份
				 * @return {object} 返回加好月份的日期对象
				 */
				addMonths: function(M) {
					var d = new Date(+this);
					d.setMonth(d.getMonth() + M);
					return d;
				},

				/**
				 * @method addDays
				 * 加上特定的天数
				 * @param {integer} 需要加上的特定天数
				 * @return {object} 返回加好天数的日期对象
				 */
				addDays: function(D) {
					var d = new Date(+this);
					d.setDate(d.getDate() + D);
					return d;
				},

				/**
				 * @method addHours
				 * 加上特定的小时数
				 * @param {integer} 需要加上的特定小时数
				 * @return {object} 返回加好小时数的日期对象
				 */
				addHours: function(h) {
					var d = new Date(+this);
					d.setHours(d.getHours() + h);
					return d;
				},

				/**
				 * @method addMinutes
				 * 加上特定的分钟数
				 * @param {integer} 需要加上的特定分钟数
				 * @return {object} 返回加好分钟数的日期对象
				 */
				addMinutes: function(m) {
					var d = new Date(+this);
					d.setMinutes(d.getMinutes() + m);
					return d;
				},

				/**
				 * @method addSeconds
				 * 加上特定的秒数
				 * @param {integer} 需要加上的特定秒数
				 * @return {object} 返回加好秒数的日期对象
				 */
				addSeconds: function(s) {
					var d = new Date(+this);
					d.setSeconds(d.getSeconds() + s);
					return d;
				},

				/**
				 * @method toDate
				 * 生成对应的日期对象
				 * @return {object} 返回日期对象
				 */
				toDate: function() {
					return new Date(this.getFullYear(), this.getMonth(), this.getDate());
				},

				/**
				 * @method toStdDateString
				 * 生成对应的日期字符串
				 * @return {string} 返回日期字符串
				 */
				toStdDateString: function() {
					return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate();
				},

				toStdDateTimeString: function() {
					return this.getFullYear() + '-' + (this.getMonth() + 1) + '-' + this.getDate() + ' ' + this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds();
				},

				/**
				 * @method toEngDateString
				 * 生成对应的英文版日期字符串
				 * @return {string} 返回英文版日期字符串
				 */
				toEngDateString: function() {
					var h = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
					return h[this.getMonth()] + '-' + this.getDate() + '-' + this.getFullYear();
				},

				/**
				 * @method toFormatString
				 * 生成需要的格式的日期字符串
				 * @param {string} 格式　例如(yyyy-mm-dd)
				 * @return {string} 返回特定格式的日期字符串
				 */
				toFormatString: function(fmt) {
					var h = {
						'y': this.getFullYear(),
						'M': this.getMonth() + 1,
						'd': this.getDate(),
						'h': this.getHours(),
						'm': this.getMinutes(),
						's': this.getSeconds(),
						'S': this.getMilliseconds()
					};
					var minL = {
						'y': 2
					};
					for (var name in h) {
						if (h.hasOwnProperty(name) && !(name in minL))
							minL[name] = h[name].toString().length;
					}
					return fmt.replace(/([yMdhmsS])\1*/g, function(a, b) {
						var t = h[b];
						var l = Math.max(a.length, minL[b]);
						return ('0'.repeat(l) + t).slice(-l);
					});
				}
			});
			return {
				/**
				 * @description 1-9返回01,02,...
				 * @param {number} n
				 * @return {string} 返回处理后的数字
				 * @example
				 * \Turtle.dateUtil.formatNum(5)   // 05
				 * \Turtle.dateUtil.formatNum(10)   // 10
				 */
				formatNum: function(n) {
					if (n < 10) {
						return '0' + n;
					}
					return n.toString();
				},
				/**
				 * @description 将字符串转换为日期，支持格式y-m-d ymd (y m r)以及标准的
				 * @return {Date} 返回日期对象
				 */
				parse: function(dateStr, formatStr) {
					if (typeof dateStr === 'undefined') {
						return null;
					}
					if (typeof formatStr === 'string') {
						var _d = new Date(formatStr);
						//首先取得顺序相关字符串
						var arrStr = formatStr.replace(/[^ymd]/g, '').split('');
						if (!arrStr && arrStr.length != 3) {
							return null;
						}

						formatStr = formatStr.replace(/y|m|d/g, function(k) {
							switch (k) {
								case 'y':
									return '(\\d{4})';
								case 'm':
								case 'd':
									return '(\\d{1,2})';
							}
						});

						var reg = new RegExp(formatStr, 'g');
						var arr = reg.exec(dateStr);

						var dateObj = {};
						for (var i = 0, len = arrStr.length; i < len; i++) {
							dateObj[arrStr[i]] = arr[i + 1];
						}
						return new Date(dateObj['y'], dateObj['m'] - 1, dateObj['d']);
					}
					return null;
				},
				/**
				 * @description将日期格式化为字符串
				 * @param {date} date 时间对象
				 * @param {string} [format=Y年M月D日 H时F分S秒] 格式化结构
				 * @return {string} 常用格式化字符串
				 * @example
				 * var d = new Date();
				 * \Turtle.dateUtil.format(d, 'Y/m/d');
				 * \Turtle.dateUtil.format(d, 'Y/m/d h:f:s');
				 */
				format: function(date, format) {
					if (arguments.length < 2 && !date.getTime) {
						format = date;
						date = new Date();
					}
					if (typeof format != 'string') {
						(format = 'Y年M月D日 H时F分S秒');
					}
					return format.replace(/[ymdhfs]/gi, function(a) {
						switch (a) {
							case "y":
								return (date.getFullYear() + "").slice(2);
							case "Y":
								return date.getFullYear();
							case "m":
								return date.getMonth() + 1;
							case "M":
								return this.formatNum(date.getMonth() + 1);
							case "d":
								return date.getDate();
							case "D":
								return this.formatNum(date.getDate());
							case "h":
								return date.getHours();
							case "H":
								return this.formatNum(date.getHours());
							case "f":
								return date.getMinutes();
							case "F":
								return this.formatNum(date.getMinutes());
							case "s":
								return date.getSeconds();
							case "S":
								return this.formatNum(date.getSeconds());
						}
					}.bind(this));
				},
				/**
				 * 判断是不是时间对象
				 * @method Turtle.dateUtil.isDate
				 * @see http://underscorejs.org/#isDate
				 * @deprecated
				 */
				isDate: _.isDate,
				/**
				 * 是否为闰年
				 * @param {num|date} year
				 * @return {boolean} 返回值
				 * @example
				 * \Turtle.dateUtil.isLeapYear(new Date());
				 * \Turtle.dateUtil.isLeapYear(2015);
				 */
				isLeapYear: function(year) {
					//传入为时间格式需要处理
					if (_.isDate(year)) {
						year = year.getFullYear();
					}
					if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
						return true;
					}
					return false;
				},

				/**
				 * 获取一个月份的天数
				 * @param {num|date} year
				 * @param {num} [month] 月份
				 * @return {num} 返回天数
				 * @example
				 * \Turtle.dateUtil.getDaysOfMonth(new Date());  // 当前时间
				 * \Turtle.dateUtil.getDaysOfMonth(2014, 3);     // 2014, 3月份
				 */
				getDaysOfMonth: function(year, month) {
					//自动减一以便操作
					if (_.isDate(year)) {
						month = year.getMonth(); //注意此处月份要加1，所以我们要减一
						//month = year.getMonth()+1; //注意此处月份要加1，使用日期API
						year = year.getFullYear();
					} else {
						month--;
					}
					//return new Date(year,month,0).getDate();
					return [31, this.isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
				},

				/**
				 * 获取一个月份1号是星期几，注意此时的月份传入时需要自主减一
				 * @param {num|date} year 可能是年份或者为一个date时间
				 * @param {num} [month] 月份
				 * @return {num} 当月一号为星期几，0是星期天，1是星期一
				 * @example
				 * \Turtle.dateUtil.getBeginDayOfMouth(new Date());  // 当前月份一号是星期几
				 * \Turtle.dateUtil.getBeginDayOfMouth(2014, 3);     // 2014年3月1号是星期几
				 */
				getBeginDayOfMouth: function(year, month) {
					//自动减一以便操作
					if (_.isDate(year)) {
						month = year.getMonth();
						year = year.getFullYear();
					} else {
						month--;
					}
					var d = new Date(year, month, 1);
					return d.getDay();
				},
				// parameter: dt should be /Date(136883030349000)/
				// return: 2013-07-09 10:49:08
				ToDate: function(dt, dtFmt) {
					dtFmt = dtFmt || "yyyy-MM-dd hh:mm:ss";
					try {
						var d = dt.toString().replace('/Date(', '').replace(")/", "")
						var dtm = new Date(parseInt(d, 10));
						if (!Turtle.isNullValue(dtm)) {
							return dtm.Format(dtFmt);
						}
						return "";
					} catch (err) {
						return "";
					}
				},
				/**
				 * 获取两个日期的间隔时间
				 * @param {Date} date1 - date A
				 * @param {Date} data2 - date B
				 * @param {String} interval - 间隔类型（毫秒、秒、分钟、小时、天、月、年）
				 * @return {Number}}   the difference
				 */
				dateDiff: function(date1, date2, interval) {
					if ($.type(date1) !== 'date')
						date1 = date1.toDate();
					if ($.type(date2) !== 'date')
						date2 = date2.toDate();

					//do not check the input
					var timeDiff = Math.abs(date1.getTime() - date2.getTime());

					switch (interval) {
						case 'S':
							return timeDiff;
						case 's':
							return Math.round(timeDiff / 1000);
						case 'm':
							return Math.round(timeDiff / 1000 / 60);
						case 'h':
							return Math.round(timeDiff / 1000 / 60 / 60);
						case 'd':
							return Math.round(timeDiff / 1000 / 60 / 60 / 24);
						case 'M':
							return Math.abs(
								(date1.getFullYear() - date2.getFullYear()) * 12 +
								(date1.getMonth() - date2.getMonth()));
						case 'y':
							return Math.abs(date1.getFullYear() - date2.getFullYear());
						default:
							return null;
					}
				}
			}
		}
	}
	return new fun();
});

// AJAX调用
define('_tAjaxUtil',function(){
	function fun(){
		this.initialize();
	}
	fun.prototype={
		initialize:function(){
		},
		interface:function(){
			return{
				ajax:this.ajax,
			}
		},
		ajax:function(){
			return {
				GetJsonP: function(url, dataOrSuccess, successOrError, error) {
			      this._myAjaxP(url, dataOrSuccess, successOrError, error, "GET");
			    },
			    PostJsonP:function(url, dataOrSuccess, successOrError, error) {
			      this._myAjaxP(url, dataOrSuccess, successOrError, error, "POST");
			    },
			    PostJson:function(url, dataOrSuccess, successOrError, error) {
			      this._myAjax(url, dataOrSuccess, successOrError, error, "POST");
			    },
			    GetJson:function(url, dataOrSuccess, successOrError, error) {
			      this._myAjax(url, dataOrSuccess, successOrError, error, "GET");
			    },
			    _myAjaxP: function(url, dataOrSuccess, successOrError, error, type) {
			      var data = null;
			      var successcb = null;
			      var errorcb = null;
			      if (dataOrSuccess) {
			        if ($.isFunction(dataOrSuccess)) {
			          data = {};
			          successcb = dataOrSuccess;
			          errorcb = successOrError || function() {};
			        } else {
			          data = dataOrSuccess;
			          successcb = successOrError || function() {};
			          errorcb = error || function() {};
			        }
			      } else {
			        data = {};
			        successcb = function() {};
			        errorcb = function() {};
			      }
			      Turtle.showLoading();
			      $.ajax({
			        type: type, //"get",
			        dataType: "jsonp",
			        jsonp: "callback",
			        cache: false,
			        url: url + "?random=" + (new Date()).getMilliseconds(),
			        data: data,
			        async: Turtle.isNullValue(data.async) ? true : data.async,
			        error: function(jqXHR, textStatus, errorThrown) {
			          errorcb(jqXHR, textStatus, errorThrown);
			        }
			      }).done(function(data) {
			        Turtle.hideLoading();
			        successcb(data);
			      })
			    },
			    _myAjax: function(url, dataOrSuccess, successOrError, error, type) {
			      var data = null;
			      var successcb = null;
			      var errorcb = null;
			      if (dataOrSuccess) {
			        if ($.isFunction(dataOrSuccess)) {
			          data = {};
			          successcb = dataOrSuccess;
			          errorcb = successOrError || function() {};
			        } else {
			          data = dataOrSuccess;
			          successcb = successOrError || function() {};
			          errorcb = error || function() {};
			        }
			      } else {
			        data = {};
			        successcb = function() {};
			        errorcb = function() {};
			      }
			      Turtle.showLoading();
			      $.ajax({
			        type: type, // "POST",
			        dataType: "json",
			        url: url + "?random=" + (new Date()).getMilliseconds(),
			        data: data,
			        async: Turtle.isNullValue(data.async) ? true : data.async,
			        error: function(jqXHR, textStatus, errorThrown) {
			          errorcb(jqXHR, textStatus, errorThrown);
			        }
			      }).done(function(data) {
			        Turtle.hideLoading();
			        successcb(data);
			      })
			    } 
			}
		}
	}
	return new fun();
});

// 获取当前位置（省市区街道）
define('_tPositionUtil',function(){
	function fun(){
		this.initialize();
	}
	fun.prototype={
		initialize: function() {},
		interface: function() {
			return {
				position: this.position,
			}
		},
		position: function() {
			return {
				//mark 【baidu:从百度接口获取; google:从google接口获取。】
				//callback 成功回调，参数为返回国家省市区街道数组
				//errorBack 失败回调，参数为失败提示字符穿
				//调用方式：
				//		turtle.position.getCurrentPosition('baidu',function(position){console.log(position)})
				//		turtle.position.getCurrentPosition('google',function(position){console.log(position)})
				// 第一步
				getCurrentPosition: function(mark, callback, errorBack) {
					callback = callback || function() {};
					errorBack = errorBack || function() {};
					this.getLocation(mark, callback, errorBack);
				},
				//第二步
				getLocation: function(mark, callback, errorBack) {
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(this.showPosition.bind(this, mark, callback, errorBack), this.showError.bind(this, errorBack));
					} else {
						errorBack("浏览器不支持地理定位。");
					}
				},
				//第三步
				showPosition: function(mark, callback, errorBack, position) {
					// $("#latlon").html("纬度:" + position.coords.latitude + '，经度:' + position.coords.longitude);
					var latlon = position.coords.latitude + ',' + position.coords.longitude;
					if (mark == 'baidu') {
						this.getPositionsFromBaidu(latlon, callback, errorBack);
					} else if (mark == 'google') {
						this.getPositionsFromGoogle(latlon, callback, errorBack);
					}
				},

				//百度方法
				getPositionsFromBaidu: function(latlon, callback, errorBack) {
					var url = "http://api.map.baidu.com/geocoder/v2/?ak=C93b5178d7a8ebdb830b9b557abce78b&callback=renderReverse&location=" + latlon + "&output=json&pois=0";
					$.ajax({
						type: "GET",
						dataType: "jsonp",
						url: url,
						beforeSend: function() {
							//alert('正在定位...');
						},
						success: function(json) {
							if (json.status == 0) {
								//{"status":0,"result":{"location":{"lng":121.30043201899,"lat":31.204465895219},"formatted_address":"上海市青浦区徐灵路","business":"华漕","addressComponent":{"city":"上海市","country":"中国","direction":"","distance":"","district":"青浦区","province":"上海市","street":"徐灵路","street_number":"","country_code":0},"poiRegions":[],"sematic_description":"二联佳苑南451米","cityCode":289}}      
								var addressList = json.result.addressComponent;
								var positions = new Array(4);
								positions[0] = addressList['street']; //road
								positions[1] = addressList['district']; //area
								positions[2] = addressList['city']; //city
								positions[3] = addressList['province']; //province
								positions[4] = addressList['country']; //country

								callback(positions);
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							errorBack(latlon + "地址位置获取失败");
						}
					});
				},
				//google方法
				getPositionsFromGoogle: function(latlon, callback, errorBack) {
					var url = 'http://maps.google.cn/maps/api/geocode/json?latlng=' + latlon + '&language=CN';
					$.ajax({
						type: "GET",
						url: url,
						beforeSend: function() {
							//alert('正在定位...');
						},
						success: function(json) {
							if (json.status == 'OK') {
								// {"results":[{"address_components":[{"long_name":"纪翟支路","short_name":"纪翟支路","types":["route"]},{"long_name":"闵行区","short_name":"闵行区","types":["sublocality_level_1","sublocality","political"]},{"long_name":"上海","short_name":"上海","types":["locality","political"]},{"long_name":"上海市","short_name":"上海市","types":["administrative_area_level_1","political"]},{"long_name":"中国","short_name":"CN","types":["country","political"]},{"long_name":"201107","short_name":"201107","types":["postal_code"]}],"formatted_address":"中国上海市闵行区纪翟支路 邮政编码: 201107","geometry":{"bounds":{"northeast":{"lat":31.2039695,"lng":121.3012532},"southwest":{"lat":31.2024512,"lng":121.2999959}},"location":{"lat":31.2035326,"lng":121.3008692},"location_type":"GEOMETRIC_CENTER","viewport":{"northeast":{"lat":31.2045593302915,"lng":121.3019735302915},"southwest":{"lat":31.2018613697085,"lng":121.2992755697085}}},"place_id":"ChIJezvHuRtnsjURvNLH_egxCis","types":["route"]}],"status":"OK"}   
								var addressList = json.results[0].address_components;
								var positions = new Array(4);
								positions[0] = ''; //road
								positions[1] = ''; //area
								positions[2] = ''; //city
								positions[3] = ''; //province
								positions[4] = ''; //country
								$.each(addressList, function(index, array) {
									if (index > 4) {
										return false; //跳出循环
									}
									positions[index] = array['long_name'];
								});
								callback(positions);
							}
						},
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							errorBack(latlon + "地址位置获取失败");
						}
					});
				},
				showError: function(errorBack, error) {
					switch (error.code) {
						case error.PERMISSION_DENIED:
							errorBack("定位失败,用户拒绝请求地理定位");
							break;
						case error.POSITION_UNAVAILABLE:
							errorBack("定位失败,位置信息是不可用");
							break;
						case error.TIMEOUT:
							errorBack("定位失败,请求获取用户位置超时");
							break;
						case error.UNKNOWN_ERROR:
							errorBack("定位失败,定位系统失效");
							break;
					}
				}
			}
		}
	}
	return new fun();
});

// 其他常用方法封装
define('_tcommUtil',function(){
	function fun(){
		this.initialize();
	}
	fun.prototype = {
		initialize: function() {},
		interface: function() {
			return {
				isNullValue: this.isNullValue,
				isEmptyObject: this.isEmptyObject,
				isEmail: this.isEmail,
				enterClick: this.enterClick,
				getQueryString: this.getQueryString,
				clone: this.clone,
				stringFormat: this.stringFormat,
				getType: this.getType,
				stringifyJSONstr: this.stringifyJSONstr,
				strToJson: this.strToJson,
				jsonToObject: this.jsonToObject,
				createGuid: this.createGuid,
				createHtmlObj: this.createHtmlObj,
				toArraySelf: this.toArraySelf,
				loadCss: this.loadCss,
				loadCssHref: this.loadCssHref,
				loadJs: this.loadJs,
				loadJsSrc: this.loadJsSrc,
				loadJsSrcOrder: this.loadJsSrcOrder
			}
		},
		isNullValue: function(val) {
			var _val = $.trim(val);
			return _val === undefined || _val == "" || _val == null || _val == "null";
		},
		//是否空对象
		isEmptyObject: function(obj) {
			if (obj === null || obj === undefined) {
				return true;
			}
			if (typeof(obj) == "object" && obj.length > 0) {
				return false;
			}
			if (typeof(obj) == "object") {
				var blExists = false;
				for (var key in obj) {
					blExists = true;
					break;
				}
				return !blExists;
			}
			return false;
		},
		//验证邮箱
		isEmail: function(emailStr) {
			var szReg = /^(?:[a-zA-Z0-9]+[_\-\+\.]?)*[a-zA-Z0-9]+@(?:([a-zA-Z0-9]+[_\-]?)*[a-zA-Z0-9]+\.)+([a-zA-Z]{2,})+$/;
			var bChk = szReg.test(emailStr);
			return bChk;
		},
		//回车执行fn
		enterClick: function(event, fn) {
			e = event ? event : (window.event ? window.event : null);
			if (e.keyCode == 13) {
				//执行的方法
				fn();
			}
		},
		//获取url参数
		getQueryString: function(name) {
			var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
			var r = window.location.search.substr(1).match(reg);
			if (r != null)
				return unescape(r[2]);
			return null;
		},
		//克隆对象
		clone: function(obj) {
			if (Turtle.isEmptyObject(obj)) {
				return obj;
			}
			if (_.isArray(obj)) {
				var list = [];
				for (var i = 0; i < obj.length; i++) {
					list.push(_.clone(obj[i]));
				}
				return list;
			} else if (_.isObject(obj)) {
				var cloneObj = {};
				for (var key in obj) {
					if (_.isArray(obj[key]) || _.isObject(obj[key])) {
						cloneObj[key] = _.clone(obj[key]);
					} else {
						cloneObj[key] = obj[key];
					}
				}
				return cloneObj;
			}
			return obj;
		},
		//str字符串格式化赋值
		//eg：stringFormat('我叫$1,来自$2','Alec','中国')
		stringFormat: function(str) {
			var args = arguments;
			if (args.length == 0)
				return str;
			return str.replace(/\$(\d)/g, function(w, d) {
				return args[d] == undefined ? '' : args[d];
			});
		},
		//获取对象类型
		getType: function(e) {
			if (null == e)
				return String(e);
			var t = {
					"[object Boolean]": "boolean",
					"[object Number]": "number",
					"[object String]": "string",
					"[object Function]": "function",
					"[object Array]": "array",
					"[object Date]": "date",
					"[object RegExp]": "regexp",
					"[object Error]": "error"
				},
				r = Object.prototype.toString.call(e);
			if (r in t)
				return t[r];
			"[object Object]" == r && (r = e + "");
			var n = r.match((/^\[object (HTML\w+)\]$/));
			return (n ? n[1] : "object")
		},
		//任何对象转化为json字符串
		stringifyJSONstr: function(e) {
			var t, r = window.JSON;
			try {
				if (r && r.stringify)
					t = r.stringify(e);
				else {
					var n, i, a = [],
						c = 0,
						s = {
							"\n": "\\n",
							"\r": "\\r",
							"\f": "\\f"
						};
					switch (this.getType(e)) {
						case null:
						case "undefined":
							t = "null";
							break;
						case "object":
							for (i in e)
								e.hasOwnProperty(i) && (a[c++] = this.stringifyJSONstr(i) + ":" + this.stringifyJSONstr(e[i]));
							t = "{" + a.join(",") + "}";
							break;
						case "array":
							for (c = 0, n = e.length; n > c; c++)
								a[c] = this.stringifyJSONstr(e[c]);
							t = "[" + a.join(",") + "]";
							break;
						case "string":
							t = '"' + e.replace(this.stringifyJSONstr, function(e) {
								return s[e] || "\\" + e
							}) + '"';
							break;
						case "date":
							t = "new Date(" + e.getTime() + ")";
							break;
						case "number":
						case "boolean":
						case "function":
						case "regexp":
							t = e.toString();
							break;
						default:
							t = "null"
					}
				}
				return t
			} catch (u) {}
			return null
		},
		//str转化为json对象
		strToJson: function(str) {
			return window.JSON.parse(str);
		},
		//json转换成对象
		jsonToObject: function(jsonString) {
			if (Turtle.isNullValue(jsonString) || typeof(jsonString) != "string") {
				return null;
			}
			jsonString = $.trim(jsonString);
			try {
				return eval("(" + jsonString + ")");
			} catch (ex) {}
			return null;
		},
		//创建GUID
		createGuid: function() {
			var guid = "";
			for (var i = 1; i <= 32; i++) {
				var n = Math.floor(Math.random() * 16.0).toString(16);
				guid += n;
				if ((i == 8) || (i == 12) || (i == 16) || (i == 20)) {
					guid += "-";
				}
			}
			return guid;
		},
		//根据html创建html对象
		createHtmlObj: function(sHtml) {
			// 创建一个可复用的包装元素
			var recycled = document.createElement('div'),
				// 创建标签简易匹配
				reg = /^<([a-zA-Z]+)(?=\s|\/>|>)[\s\S]*>$/,
				// 某些元素HTML标签必须插入特定的父标签内，才能产生合法元素
				// 另规避：ie7-某些元素innerHTML只读
				// 创建这些需要包装的父标签hash
				hash = {
					'colgroup': 'table',
					'col': 'colgroup',
					'thead': 'table',
					'tfoot': 'table',
					'tbody': 'table',
					'tr': 'tbody',
					'th': 'tr',
					'td': 'tr',
					'optgroup': 'select',
					'option': 'optgroup',
					'legend': 'fieldset'
				};
			// 闭包重载方法（预定义变量避免重复创建，调用执行更快，成员私有化）
			this.createHtmlObj = function(sHtml) {
					sHtml = sHtml.trim();
					// 若不包含标签，调用内置方法创建并返回元素
					if (!reg.test(sHtml)) {
						return document.createElement(sHtml);
					}
					// hash中是否包含匹配的标签名
					var tagName = hash[sHtml.match(reg)[1]];
					// 若无，向包装元素innerHTML，创建/截取并返回元素
					if (!tagName) {
						recycled.innerHTML = sHtml;
						return recycled.removeChild(recycled.firstChild);
					}
					// 若匹配hash标签，迭代包装父标签，并保存迭代层次
					var deep = 0,
						element = recycled;
					do {
						sHtml = '<' + tagName + '>' + sHtml + '</' + tagName + '>';
						deep++;
					}
					while (tagName = hash[tagName]);
					element.innerHTML = sHtml;
					// 根据迭代层次截取被包装的子元素
					do {
						element = element.removeChild(element.firstChild);
					}
					while (--deep > -1);
					// 最终返回需要创建的元素
					return element;
				}
				// 执行方法并返回结果
			return this.createHtmlObj(sHtml);
		},
		// 把list转化为数组
		toArraySelf: function(list) {
			try {
				return Array.prototype.slice.apply(list)
			} catch (e) {
				var arr = [];
				for (var i = 0, l = list.length; i < l; i++) {
					arr.push(list[i]);
				}
				return arr;
			}
		},
		//加载CSS，直接把css内容加载到head中
		loadCss: function(id, content) {
			var newStyle = document.createElement("style");
			newStyle.type = "text/css";
			newStyle.id = id;
			if (typeof newStyle.styleSheet != "undefined") {
				newStyle.styleSheet.cssText = content;
			} else {
				newStyle.innerHTML = content;
			}
			document.getElementsByTagName("head")[0].appendChild(newStyle);
		},
		//加载CSS引用
		loadCssHref: function(urlList) {
			urlList = urlList || [];
			if(_.isString(urlList)){
				urlList = [urlList];
			}
			for (var i = 0; i < urlList.length; i++) {
				var link = document.createElement("link");
				link.type = "text/css";
				link.rel = "stylesheet";
				link.href = urlList[i];
				document.getElementsByTagName("head")[0].appendChild(link);
			}
		},
		// 加载JavaScript内容到页面
		loadJs:function(content){
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.innerHTML = content;
			document.body.appendChild(script);
		},
		// 加载js引用
		loadJsSrc: function(urlList) {
			urlList = urlList || [];
			if(_.isString(urlList)){
				urlList = [urlList];
			}
			for (var i = 0; i < urlList.length; i++) {
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.src = urlList[i];
				document.getElementsByTagName("head")[0].appendChild(script);
			}
		},
		// 加载js引用，多个js时按顺序加载，前一个加载完成再加载下一个，全部加载完，执行回调
		loadJsSrcOrder:function(urlList, callback) {
			urlList = urlList || [];
			if(_.isString(urlList)){
				urlList = [urlList];
			}
			callback = callback || function() {};
			var mark = 0;
			var loadJavaScript = function(jsurl) {
				var oHead = document.getElementsByTagName('head')[0];
				if (oHead) {
					var oScript = document.createElement('script');
					oScript.setAttribute('src', jsurl);
					oScript.setAttribute('type', 'text/javascript');
					oScript.onreadystatechange = loadFunction;
					oScript.onload = callbackfunction;
					oHead.appendChild(oScript);
				}
			}
			var callbackfunction = function() {
				mark++;
				if (mark < urlList.length) {
					loadJavaScript(urlList[mark]);
				} else {
					callback();
				}
			};
			var loadFunction = function() {
				if (this.readyState == 'complete' || this.readyState == 'loaded') {
					callbackfunction();
				}
			};
			loadJavaScript(urlList[mark]);
		}
	}
	return new fun();
});

// 操作系统/浏览器类型判断
// eg:
//    Turtle.os.android,Turtle.os.ios
//    Turtle.browser.chrome,Turtle.browser.ie,Turtle.browser.weixin
//    Turtle.os.tablet 平板电脑，Turtle.os.phone 手机
define('_tOsBrowserUtil',function(){
	function fun(){
		this.initialize();
	}
	fun.prototype = {
		initialize: function() {},
		interface: function() {
			var _dete = this.detect();
			return {
				os: _dete.os,
				browser:_dete.browser
			}
		},
		detect: function() {
			var ua = navigator.userAgent,
				os = this.os = {},
				browser = this.browser = {},
				webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
				android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
				osx = !!ua.match(/\(Macintosh\; Intel /),
				ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
				ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
				iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
				webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
				wp = ua.match(/Windows Phone ([\d.]+)/),
				touchpad = webos && ua.match(/TouchPad/),
				kindle = ua.match(/Kindle\/([\d.]+)/),
				silk = ua.match(/Silk\/([\d._]+)/),
				blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
				bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
				rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
				playbook = ua.match(/PlayBook/),
				chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
				firefox = ua.match(/Firefox\/([\d.]+)/),
				ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
				webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
				safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/),
				weixin = ua.match(/MicroMessenger\/([\d.]+)/)

			if (browser.webkit = !!webkit) browser.version = webkit[1]

			if (android) os.android = true, os.version = android[2]
			if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
			if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
			if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
			if (wp) os.wp = true, os.version = wp[1]
			if (webos) os.webos = true, os.version = webos[2]
			if (touchpad) os.touchpad = true
			if (blackberry) os.blackberry = true, os.version = blackberry[2]
			if (bb10) os.bb10 = true, os.version = bb10[2]
			if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
			if (playbook) browser.playbook = true
			if (kindle) os.kindle = true, os.version = kindle[1]
			if (silk) browser.silk = true, browser.version = silk[1]
			if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
			if (chrome) browser.chrome = true, browser.version = chrome[1]
			if (firefox) browser.firefox = true, browser.version = firefox[1]
			if (ie) browser.ie = true, browser.version = ie[1]
			if (safari && (osx || os.ios)) {
				browser.safari = true;
				if (osx) browser.version = safari[1]
			}
			if (webview) browser.webview = true
			if (weixin) browser.weixin = true, browser.version = weixin[1]

			os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
				(firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
			os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
				(chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
				(firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))
			return {
				os: function(){
					return os;
				},
				browser:function(){
					return browser;
				}
			}
		}
	}
	return new fun();
});

(function() {
	window.Turtle || (window.turtle = window.Turtle = {});
	require(['_tUIViewUtil','_tPageUtil', '_tCookieStorage','_tDateUtil','_tAjaxUtil', '_tPositionUtil', '_tcommUtil', '_tOsBrowserUtil'], 
		function(tUIView,tPagebase,tCookieStorage,_tDateUtil,_tAjaxUtil,_tPositionUtil,_tcommUtil,_tOsBrowserUtil) {
		var utils = Array.prototype.slice.call(arguments);
		_.each(utils,function(util,index){
			for (var n in util.interface()) {
				if(n=='dateUtil' || n=='ajax' || n=='position' || n=='os' || n=='browser'){
					Turtle[n] = $.proxy(util.interface()[n], util)();
				}else{
					Turtle[n] = $.proxy(util.interface()[n], util);
				}
			}
		}.bind(this))
	}, this);
})()