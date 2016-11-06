var JSON = JSON || {};
JSON.stringify = JSON.stringify || function (obj) {
    var t = typeof (obj);
    if (t != "object" || obj === null) {
        if (t == "string") obj = '"' + obj + '"';
        return String(obj);
    } else {
        var n, v, json = [],
            arr = (obj && obj.constructor == Array);
        for (n in obj) {
            v = obj[n];
            t = typeof (v);
            if (t == "string") v = '"' + v + '"';
            else if (t == "object" && v !== null) v = JSON.stringify(v);
            json.push((arr ? "" : '"' + n + '":') + String(v));
        }
        return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
    }
};

JSON.parse = JSON.parse || function (str) {
    if (str === "") str = '""';
    eval("var p=" + str + ";");
    return p;
};

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var Util = {
	resolveJsonKey :  function( path, obj ) {
		return path.split('.').reduce( function( prev, curr ) {
			return prev[curr];
		}, obj || this );
	},
	showTimingResults: function(){
		window.onload = function(){
			setTimeout(function(){
				if ( document.getElementsByTagName("html")[0].className.indexOf('lte-ie8') > -1 ) {
					return;
				}

				var pageSpeed = [];
				var values = [];
				var colors = [];

				if ( performance.navigation.redirectCount == 0 ) {
					pageSpeed[0] = 'Redirections: 0';
					colors[0] = 'lightgrey';
				} else {
					values[0] = (performance.timing.redirectEnd-performance.timing.redirectStart)/1000;
					pageSpeed[0] = 'Redirections: ' + performance.navigation.redirectCount + ' @ ' + values[0];
					colors[0] = (values[0] >= 0.05 || performance.navigation.redirectCount > 2 ? 'red' : 'black');
				}

				values[1] = (performance.timing.domainLookupStart-performance.timing.fetchStart)/1000;
				pageSpeed[1] = 'App Cache Time: ' + values[1];
				colorLogic(1, 0.5, 0);

				values[2] = (performance.timing.domainLookupEnd-performance.timing.domainLookupStart)/1000;
				pageSpeed[2] = 'DNS Time: ' + values[2];
				colorLogic(2, 0.05, 0.01);

				values[3] = (performance.timing.connectEnd-performance.timing.connectStart)/1000;
				pageSpeed[3] = 'TCP Time: ' + values[3];
				colorLogic(3, 0.05, 0.02);

				values[4] = (performance.timing.responseStart-performance.timing.requestStart)/1000;
				pageSpeed[4] = 'Request Time: ' + values[4];
				colorLogic(4, 0.5, 0.2);

				values[5] = (performance.timing.responseEnd-performance.timing.responseStart)/1000;
				pageSpeed[5] = 'Response Time: ' + values[5];
				colorLogic(5, 0.015, 0.003);

				values[6] = (performance.timing.domComplete-performance.timing.domLoading)/1000;
				pageSpeed[6] = 'DOM Time: ' + values[6];
				colorLogic(6, 2, 1);

				values[7] = (performance.timing.loadEventEnd-performance.timing.loadEventStart)/1000;
				pageSpeed[7] = 'onLoad Time: ' + values[7];
				colorLogic(7, 0.1, 0.03);

				values[8] = (performance.timing.loadEventEnd-performance.timing.navigationStart)/1000;
				pageSpeed[8] = 'Total Page Load Time: ' + values[8];
				colorLogic(8, 5, 2);

				console.log('******* BEGIN PERFORMANCE TIMING RESULTS *******');
				if ( !!window.chrome || navigator.userAgent.toLowerCase().indexOf('firefox') > -1 || navigator.userAgent.toLowerCase().indexOf('safari') != -1 ) {
					for (var i = 0; i < pageSpeed.length; i++) {
						var perc = '%c';
						var css = 'color:' + colors[i] + ';';

						if ( colors[i] == 'red' ) {
							console.warn(perc + pageSpeed[i] + 's', css);
						} else {
							console.log(perc + pageSpeed[i] + 's', css);
						}
					}
				} else {
					if ( colors[i] == 'red' ) {
						console.warn(pageSpeed[i] + 's');
					} else {
						console.log(pageSpeed[i] + 's');
					}
				}
				console.log('******* END PERFORMANCE TIMING RESULTS *******');

				function colorLogic(i, bad, good) {
					if ( values[i] >= bad ) {
						colors[i] = 'orange';
					} else if ( values[i] == 0 ) {
						colors[i] = 'lightgrey';
					} else if ( values[i] < good ) {
						colors[i] = 'green';
					} else {
						colors[i] = 'black';
					}
				}
			}, 0);
		};
	},
	guid:function () {
	  function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
		  .toString(16)
		  .substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
		s4() + '-' + s4() + s4() + s4();
	},
	ajax: function(options){

    var _options = {
		  method: options.method,
		  url: options.url  + "?_=" + Util.guid(),
		  data: options.data,
		  cache:false,
		  dataType:'json'
		};

    if(typeof(options.headers) == 'object'){
      _options["headers"] = options.headers;
    }

		$.ajax(_options).done(function(payload) {
      console.log(payload);
      if(payload.code == 401){
       // window.location = "/login?status=not-logged";
        //return;
      }

      if(payload.code != 200 && payload.code != 422){
       // window.location = "/error?code=" + payload.code ;
        //return;
      }

      if(typeof(options.done) == 'function'){
				options.done(payload);
			}
		}).error(function( jqXHR , textStatus , errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
      if(typeof(options.error) == 'function'){
				options.error(jqXHR , textStatus , errorThrown);
			}
		}).always(function() {
      if(typeof(options.always) == 'function'){
				options.always();
			}
		});
	},
  setCookie: function (name, value, expires, path, domain, secure) {
    var today = new Date();
    today.setTime(today.getTime());

    if (expires) {
        expires = expires * 1000 * 60 * 60 * 24;
    }
    var expires_date = new Date(today.getTime() + (expires));

    document.cookie = name + "=" + escape(value) +
        ((expires) ? ";expires=" + expires_date.toGMTString() : "") +
        ((path) ? ";path=" + path : "") +
        ((domain) ? ";domain=" + domain : "") +
        ((secure) ? ";secure" : "");
  },
  capitalizeAllText: function (str) {
      str = str.toLowerCase();
      return str.replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
  },
  stripTags: function (input, allowed) {
    allowed = (((allowed || '') + '')
            .toLowerCase()
            .match(/<[a-z][a-z0-9]*>/g) || [])
        .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
        commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
    return input.replace(commentsAndPhpTags, '')
        .replace(tags, function ($0, $1) {
            return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
        });
    },
  enableDbAjax: function(el,keepDisabled){
    	var originalText = el.attr("data-original-text");
    	var originalIcon = el.attr("data-original-icon");
    	if(keepDisabled){
    		el.prop("disabled",true);
    	}else{
    		el.prop("disabled",false);
    	}
    	el.attr("title",originalText);
    	el.html("<i class='fa fa-"+originalIcon+"'></i> "+originalText);
  },
  avoidDbAjax:function(el){
    	var waitingText = el.attr("data-waiting-text");
    	el.prop("disabled",true);
    	el.html("<i class='fa fa-spinner fa-pulse'></i> "+waitingText);
  },
  replaceAll: function (find, replace, str) {
    var find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    return str.replace(new RegExp(find, 'g'), replace);
  },
  convertToSlug: function (str) {
    str = str.replace(/^\s+|\s+$/g, '');
    str = str.toLowerCase();
    var from = "'ãàáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to = "'aaaaaeeeeiiiioooouuuunc------";
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    return str;
  },
  formatDatetime: function (data) {
      var datetime = data.split("T");
      if (datetime.length == 2) {
          var splitedDate = datetime[0].split("-");
          var time = datetime[1].substring(0,5);
          var year = splitedDate[0];
          var month = splitedDate[1];
          var day = splitedDate[2];
          return day + "/" + month + "/" + year + " " + time;
      } else {
          return data;
      }
  },
  parseToJsDate: function (datetime) {
    if (datetime != "") {
        datetime = Util.replaceAll("T", " ", datetime);
        var splitedDatetime = datetime.split(" ");
        var date = splitedDatetime[0];
        var time = splitedDatetime[1];
        var splitedDate = date.split("-");
        var splitedTime = time.split(":");
        var year = splitedDate[2];
        var month = splitedDate[1];
        var day = splitedDate[0];
        var hours = splitedTime[0];
        var minutes = splitedTime[1];
        var seconds = "00";
        var milliseconds = "00";

        if (month != "0") {
            month = (parseInt(month) - 1).toString();
        }

        if (month.length == 1) {
            month = "0" + month;
        }

        return new Date(year, month, day, hours, minutes);
    } else {
        return null;
    }
  },
  when: function (condition, then) {
      var that = this;
      if (condition()) then();
      else setTimeout(function () {
          that.when(condition, then);
      }, 50);
  },
  popupPrint:function(title,canvas){
    var mywindow = window.open('', title, 'height=400,width=600');
    mywindow.document.write('<html><head><title>'+title+'</title>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<img src="'+canvas.toDataURL("image/jpeg")+'"/>');
    mywindow.document.write('</body></html>');
    mywindow.print();
    mywindow.close();
    return true;
  },
  print: function (data){
      var result = "-";
        if((data != "" && data != "null" && data != null) || Util.isNumeric(data)){
          result = data;
        }
      return result.toString();
  },
  isNumeric: function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  },
  scrollToAnchor: function (selector,container){
    var containerSelector = 'html,body';
    if(container === "#console-modal"){
      containerSelector = ".modal";
    }
    $(containerSelector).animate({scrollTop: $(selector).offset().top - 25 },'fast');
  },
  printAlert:function(options){

    if(!options.timeout){
      options.timeout = 3000;
    }

    var uuid = Util.guid();
    var selector = "#" + uuid;
    var html = "<div onclick='$(this).remove();' id='"+uuid+"' style='margin-bottom:10px;cursor:pointer;'  class='alertInfo alert alert-"+options.type+"' role='alert'>";
    html += "<p style='font-size:16px;'><i class='fa fa-"+options.icon+"'></i> "+ options.message + "</p>";
    html += "</div>";
    $(options.container).prepend(html);
    Util.scrollToAnchor(selector,options.container);
    setTimeout(function() {
      var element = $(selector);

        
        if(!options.noFade){
          element.fadeOut(1000);
        }

        setTimeout(function() {

          if(!options.noFade){
            element.remove();
         }

        },options.timeout);
    }, options.timeout);

  }
};
