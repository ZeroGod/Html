
//公共方法
var zhouxiong = window.zhouxiong || {};
zhouxiong.zerogod = zhouxiong.zerogod || {};

/**
* @class 创建类
* @singleton
* @createTime 2012-08-28
* @updateTime
* @note
* @version 1.0
*/

(function (window) {
    function empty(string) { //去除空格
        return string.replace(/\s*/g, '');
    }
    window.Jser = {
        /**
        声明类型
        *@param {String} name          类名
        *@param {Object} base          基类(需要继承的父类)
        *@param {Object} members       非静态成员(javascript键值对)
        *@param {Object} staticMembers 静态成员(javascript键值对)
        *@return {Object} 声明的类
        */
        Class: function (name, base, members, staticMembers) {
            var names = empty(name).split('.'); // 字符串去空格，分割成字符串数组
            var klassName = names.pop();        // 删除并返回数组的最后一个元素
            var klass = members && members[klassName] ? eval('(function(){ return function(){ return this.' + klassName + '.apply(this, arguments);}})()') : eval('(function(){ return function(){}})()');
            var prototype = klass.prototype;    // klass → 匿名函数function(){this.klassName.apply(this,arguments);}  获取klass的原型对象
            klass.name__ = name;                // 静态属性 klass的name__为 类名
            klass.base__ = [];                  // 静态属性 klass的base__为 基类 （可以继承多个基类,所以为数组）
            if (base) {
                klass.base__ = klass.base__.concat(base.base__);    // 若基类存在 则合并继承的基类
                klass.base__.push(base);                            // 将基类也添加到基类数组中
                jQuery.extend(prototype, base.prototype);               // 继承基类的原型
            }
            for (var i in members) {
                var j = members[i];
                if (typeof j == "function") {
                    j.belongs = klass;
                    var o = prototype[i]        // o:继承来自基类的方法 i:方法名
                    if (o && o.belongs) {
                        prototype[o.belongs.name__.replace(/\./g, '$') + '$' + i] = o;
                    }
                }
                prototype[i] = j;
            }
            klass.fn = prototype;               // 静态属性 klass的fn为 klass的原型对象
            jQuery.extend(klass, staticMembers);    // 扩展klass的属性
            var _this = window;
            while (e = names.shift())           // 删除，并返回第一个元素的值 e:命名空间的名称，没有则为全局对象window
                _this = _this[e] || (_this[e] = {});
            if (_this[klassName])               // 判断类型是否重复定义
                throw Jser.Error(name + ' 类型重复定义'); // 抛出错误
            _this[klassName] = klass;
            if (klass[klassName])               // 执行初始化的类
                klass[klassName]();
            return klass;                       //返回当前类
        },
        /**
        发送ajax请求
        */
        ajax: function (params) {
            var params = jQuery.extend({
                type: 'GET', url: '', dataType: 'text', data: null, open: Jser.noop, success: Jser.noop, callbreak: null, error: null, callbleak: null, asyn: true
            }, params);
            var url = params.url;
            url = (url.indexOf('?') != -1) ? (url + '&') : (url + '?') + (new Date()).getTime(); // 判断url是否存在?,若不存在则加?,存在则加&
            params.url = url;
            var xhr = window.ActiveXObject ? new ActiveXObject('Microsoft.XMLHTTP') : new XMLHttpRequest();
            var callbreak = function () {
                if (params.callbreak)
                    params.callbreak(xhr);
                else {
                    if (xhr.readyState == 4) {
                        var status = xhr.status;
                        if (status == 200 || status == 304) {
                            var text = xhr.responseText,
                                ret,
                                xml;
                            if (params.dataType == 'xml') {
                                var isXml = /^ *<\?xml/i.test(text);
                                xml = isXml ? xhr.responseXml || xhr.responseXML : null;
                                if (xml) {
                                    if (xml.parseError.errorCode != 0)
                                        throw Jser.Error('解析XML错误 ' + params.url + ' , 标签  ' + parseError.srcText + '  ' + parseError.reason);
                                }
                                else
                                    throw Jser.Error('解析XML错误 ' + params.url);
                            }
                            xhr.abort(); //中断请求
                            if (params.dataType == 'json') {
                                try {
                                    ret = eval('(' + text + ')');
                                }
                                catch (e_) {
                                    throw Jser.Error('解析JSON数据错误')
                                }
                            } else if (params.dataType == 'xml') {
                                ret = xml;
                            } else
                                ret = text;
                            params.success && params.success(ret);
                            return ret;
                        }
                        else {
                            var text = xhr.responseText;
                            xhr.abort();

                            if (params.error) {
                                params.error(jQuery.extend({
                                    message: text, status: status
                                }, params))
                            }
                            else
                                throw Jser.Error(status + 'Error \n' + text);
                        }
                    }
                }
            }
            params.asyn && (xhr.onreadystatechange = callbreak);
            xhr.open(params.type, params.url, params.asyn);
            params.open(xhr);
            xhr.send(params.data);
            return params.asyn || callbreak();
        },
        noop: function () {
        },
        /**
        创建一个异常对像
        * @param {String} msg 创建异常对像所需的字符串
        * @return {Error}
        * @static
        */
        Error: function (msg) {
            return new Error(msg);
        }
    }
    window.Class = Jser.Class;
})(window);

/**
扩展javascript String 对像
*/
jQuery.extend(String.prototype,
    {
        /**
        格式化字符串
        <pre>
        <code>
        var str = '今天在日本{0}发生了{1}级大{2},中{0}北京都可以感觉到{2}';
        var newStr = str.format('国', 10, '地震');
        //返回: newStr='今天在日本国发生了10级大地震,中国北京都可以感觉到地震';
        </code>
        </pre>
        * @param {String} argu1 (Optional) 可选参数 要替换的字符串
        * @param {String} argu2.. (Optional) 可选参数 要替换的字符串
        * @return {String} 返回格式化后的字符串
        */
        format: function () {
            var i = 0, val = this, len = arguments.length;
            for (; i < len; i++)
                val = val.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
            return val;
        },
        /**
        获取字符串长度,大于一个字节的算两个长度
        * @return {Number}
        */
        byteLength: function () {
            var j = 0;
            for (var i = 0, len = this.length; i < len; i++) {
                if (this.charCodeAt(i) > 255)
                    j += 2;
                else
                    j++;
            }
            return j;
        },
        /**清空字符串中所有空白*/
        empty: function () {
            return this.replace(/\s+/g, '');
        },
        /**
        截断过长的字符串
        * @param {Number} length 要从字符串的什么位置截断
        * @param {String} rep (Optional) 可选参数 截断后要替换的字串默认为"..."
        * @return {String} 返回新字符串
        */
        streamlining: function (length, rep) {
            if (this.byteLength() > length) {
                var i = this.split('');
                rep = typeof rep !== "undefined" ? rep : '...';
                length -= rep.byteLength();
                for (var j = 0, len = 0, e, ret = ''; (e = i[j]); j++) {
                    len += e.charCodeAt(0) > 255 ? 2 : 1;
                    if (length < len) {
                        return ret + rep;
                    } else {
                        ret += e;
                    }
                }
            }
            else {
                return this;
            }
        }
    });
/**
* jQuery 扩展
*/
/**
字数限制扩展,直接将文本截断
* @param {Number} limit    字数限制
* @param {String} selector 提示文本
* @param {Object} options  参数设置  isAutoLimit {Boolean} :是否自动截断默认截断  num {Number}：预警提示分界线
*/
jQuery.fn.extend({
    limit: function (limit, selector, options) {
        var interval,
            limit = limit * 1,
            options = jQuery.extend({ isAutoLimit: true, num: 0 }, options || {}),
            self = jQuery(this);
        if (!this.focused) {
            this.focused = true;
            self.focus(function () {
                interval = window.setInterval(substring, 100);
            }).blur(function () {
                clearInterval(interval);
                substring();
            });
        }
        substring();
        function substring() {
            var length = self.val().length;
            // 判断是否需要截断文本
            if (length > limit && options.isAutoLimit) {
                self.val(self.val().substring(0, limit));
                length = limit;
                if (typeof selector === "function") {
                    selector.caller(self.get(0));
                }
            }
            if (typeof selector === "string") {
                var elem = jQuery(selector), count = limit - length;
                // 预警显示
                elem[options.num > length ? "hide" : "show"]();
                elem.html((count < 0) ? "已经超过<em style='color:#DA0000'>" + count * -1 + "</em>字" : "还可以输入<em>" + count + "</em>字");
            }
        };
        return this;
    }
});

/*
本文框自动调整高度扩展
* @param {Number} minHeight    最小宽度
* @param {Number} maxHeight    最大宽度
*/
jQuery.fn.extend({
    TextAreaExpander: function (minHeight, maxHeight, callback) {

        var hCheck = !(jQuery.browser.msie || jQuery.browser.opera), interval, element;

        // resize a textarea
        function ResizeTextarea() {

            // event or initialize element?

            var e = element;

            // find content length and box width
            var vlen = e.value.length, ewidth = e.offsetWidth;
            if (vlen != e.valLength || ewidth != e.boxWidth) {

                if (hCheck && (vlen < e.valLength || ewidth != e.boxWidth)) e.style.height = "0px";
                var h = Math.max(e.expandMin, Math.min(e.scrollHeight, e.expandMax));
                e.style.overflow = (e.scrollHeight > h ? "auto" : "hidden");
                e.style.height = h + "px";
                e.valLength = vlen;
                e.boxWidth = ewidth;
                callback && callback.call(e, h);
            }

            return true;
        };

        // initialize
        this.each(function () {
            // is a textarea?
            if (this.nodeName.toLowerCase() != "textarea") return;

            // set height restrictions
            var p = this.className.match(/expand(\d+)\-*(\d+)*/i);
            this.expandMin = minHeight || (p ? parseInt('0' + p[1], 10) : 0);
            this.expandMax = maxHeight || (p ? parseInt('0' + p[2], 10) : 99999);
            element = this;
            // initial resize
            ResizeTextarea();

            // zero vertical padding and add events
            if (!this.Initialized) {
                this.Initialized = true;
                jQuery(this).css("padding-top", 0).css("padding-bottom", 0);
                //低版本的兼容
                if (jQuery.browser.msie && jQuery.browser.version < 9) {
                    jQuery(this).focus(function () {
                        interval = window.setInterval(ResizeTextarea, 100);
                    });
                    jQuery(this).blur(function () {
                        clearInterval(interval);
                        ResizeTextarea();
                    });
                } else {
                    jQuery(this).bind("propertychange", ResizeTextarea)
                    jQuery(this).bind("input", ResizeTextarea);
                }

            }
        });
        return this;
    }
});

/*
触摸高亮
* @param {string} arguments[0]  高亮className
* @param {string} arguments[1]  不可高亮的className
*/
jQuery.fn.extend({
    high: function () {
        var arg = arguments, reg = new RegExp('\\s*' + arg[0] + ''), self = jQuery(this);
        self.live('hover', function () {
            if (arg.length === 2 && typeof arg[1] === "string" && self.hasClass(arg[1])) {
                return false;
            }
            if (self.hasClass(arg[0])) {
                this.className = this.className.replace(reg, '');
            } else {
                this.className = " " + arg[0];
            }
        });
    }
})

/*
搜索提示
* @param {Object} elem 提示层 DOM Element元素
*/
jQuery.fn.extend({
    prompt: function (elem) {
        if (jQuery(this).val() !== '') {
            elem.hide();
        };

        if (!(jQuery.nodeName(this.get(0), "input") || jQuery.nodeName(this.get(0), "textarea"))) {
            return false;
        }
        if (typeof elem === "undefined") {
            throw "请传入提示元素.";
        }
        var self = this, elem = jQuery(elem), fClass = arguments[1];

        function blurFn() {
            if (this.value.length === 0) {
                elem.show();
            }
            if (typeof fClass === "string") {
                jQuery(this.parentNode).removeClass(fClass);
            }
        };
        function focusFn() {
            if (jQuery(this).val().empty() == "") {
                return false;
            }
            elem.hide();
            if (typeof fClass === "string") {
                jQuery(this.parentNode).addClass(fClass);
            }
        };
        function focusFn02() {
            if (typeof fClass === "string") {
                jQuery(this.parentNode).addClass(fClass);
            }
        };
        self.bind('blur', blurFn).bind('input', focusFn).bind('propertychange', focusFn).bind('change', focusFn).bind("focus", focusFn02);
        jQuery(function () {

        })
        return this;
    }
});

// 公共方法

//警告消息框
zhouxiong.zerogod.alert = (function () {
    var defaults = {
        txt: "",
        html: "",
        addClass: "",
        callback: jQuery.noop,
        isBtn: true,
        isBg: true,
        state: "alert" //alert:警告消息框 confirm:确认消息框       
    };
    var initialize = function () {
        var alert01 = new Alert(defaults);
        return alert01;
    };
    return {
        init: function (options) {
            jQuery.extend(defaults, options || {});
            return initialize();
        }
    }
});

//弹出框
zhouxiong.zerogod.confirm = (function () {
    var defaults = {
        txt: "",
        html: "",
        addClass: "",
        callback: jQuery.noop,
        isBtn: true,
        isBg: true,
        state: "confirm" //alert:警告消息框 confirm:确认消息框 
    };
    var initialize = function () {
        var confirm01 = new Alert(defaults);
        return confirm01;
    };
    return {
        init: function (options) {
            jQuery.extend(defaults, options || {});
            return initialize();
        }
    }
});

//弹出类
Class('Alert', null, {
    Alert: function (options) {
        jQuery.extend(this, options);
        this.sure = options.sure || jQuery.noop;
        this.cancel = options.cancel || jQuery.noop;
        this.close = options.close || jQuery.noop;
        this.creatAlert();
    },
    creatAlert: function () {
        var Me = this;
        //检测背景层是否存在
        var oBg;
        oBg = jQuery("body").children(".sweet-alert-con");
        if (!oBg.length) {
            // 创建背景层
            oBg = document.createElement("div");
            document.body.appendChild(oBg);
            oBg.className = "sweet-alert-con";
            oBg.style.display="block";
        } else {
            oBg = oBg.get(0);
        }
        Me.oBg = oBg;
        // 创建弹出层
        var oAlert = document.createElement("div"), aHTML = [];
        oAlert.className="sweet-alert";
        if(Me.state === "confirmNew")
        	{
        	aHTML.push('<a  class="tc-close close_btn"></a>');
        	}
        // tit:标题, 关闭按钮
        aHTML.push('<h2>系统提示</h2>');
        // 文本输入       
        // 判断是否需要居中显示
        var txt = Me.txt || Me.html, reg = /^(?:[^#<]*<[\w\W]+>)[^>]*jQuery/, isTXT = !reg.test(txt); //检测是否包含HTML
        // 检测是否为纯文本且文字少于27个
        if (txt.length < 27 && isTXT) {
            aHTML.push('<p class="pop_con txt-c">' + txt + '</p>');
        } else {
            aHTML.push('<div class="pop_con">' + txt + '</div>');
        }
        if (!!Me.isBtn) {
            // 确定
        	if(Me.state === "confirmNew")
        		{
        		aHTML.push('<a class="btn-sty btnSure">' + (Me.sureTxt || "立即开户") + '</a>');
        		
        		}
        	else{
            aHTML.push('<a class="btn-sty btnSure">' + (Me.sureTxt || "确&nbsp;定") + '</a>');
        	}
            // 取消
            if (Me.state === "confirm"||Me.state === "confirmNew") {
            	if(Me.state === "confirmNew")
            		{
            		 aHTML.push('<a class="btn-sty btnCancel">登&nbsp;录</a>');
            		}
            	else{
                aHTML.push('<a class="btn-sty btnCancel">取&nbsp;消</a>');
            	}
            }
           
        }
        oAlert.innerHTML = aHTML.join("");
        // 插入到body中
        document.body.appendChild(oAlert);
       // oBg.appendChild(oAlert);
        Me.oAlert = oAlert;
        var jQueryoAlert = jQuery(oAlert);
        //内容 jQuery(DOM Element)
        Me.context = jQueryoAlert.find(".pop_con");
        // 确定按钮
        Me.oSure = jQueryoAlert.find(".btnSure");
        // 取消按钮
        Me.oCancel = jQueryoAlert.find(".btnCancel");
        // 关闭按钮
        Me.oClose = jQueryoAlert.find(".close_btn");
        // 添加className
        oAlert.className = "sweet-alert" + Me.addClass;
        //添加样式
        oAlert.style.overflow="visible";
        //调整弹出框位置
        Me.onResize();
        Me.bindEvent();
        Me.callback && Me.callback.call(Me, Me.oAlert);
    },
    bindEvent: function () {
        var Me = this;
        Me.iTimer = null;
        // 确认
        this.oSure.click(function () {
        	Me.closeAlert();
            var ret;
            ret = Me.sure.call(Me, Me.oSure); //回调函数   ,默认返回undefined        
            /*if (ret !== false) {
                Me.closeAlert(); //关闭
            }*/
            return false;
        });
        // 取消 
        this.oCancel.click(function () {
            var ret;
            Me.isBg = true;
            ret = Me.cancel.call(Me, Me.oSure); //回调函数            
            if (ret !== false) {
                Me.closeAlert(); //关闭
            }
            return false;

        });
        // 关闭   
        this.oClose.click(function () {
           var ret;
            Me.isBg = true;
            ret = Me.close.call(Me, Me.oSure); //回调函数            
            if (ret !== false) {
                Me.closeAlert(); //关闭
            }
            return false;
        });
        if (Me.state === "alert") {
            Me.timer || (Me.timer = 3000);
            setTimeout(function () { if (Me.iTimer != null) { Me.closeAlert.call(Me) } }, Me.timer);
        }

        //窗口发生改变，触发onResize函数 调整弹出框
        jQuery(window).bind("resize", this.onResize);
    },
    onResize: function () {
        oAlert = this.oAlert;
        oAlert.style.left = (parseInt(document.documentElement.clientWidth || document.body.clientWidth)) / 2 + (document.documentElement.scrollLeft || document.body.scrollLeft) - oAlert.offsetWidth / 2 + "px";
        oAlert.style.top = (parseInt(document.documentElement.clientHeight || document.body.clientHeight)) / 2 + (document.documentElement.scrollTop || document.body.scrollTop) - oAlert.offsetHeight / 2 + "px";
    },
    closeAlert: function () {
        var Me = this;
        Me.iTimer = null;
        if (Me.isBg) {
            document.body.removeChild(Me.oBg); //删除节点   
        }
        document.body.removeChild(Me.oAlert); //删除节点
        return false;
    }
}, {});


zhouxiong.zerogod.confirmNew = (function () {
    var defaults = {
        txt: "",
        html: "",
        addClass: "",
        callback: jQuery.noop,
        isBtn: true,
        isBg: true,
        state: "confirmNew" //alert:警告消息框 confirmNew:确认消息框 .关闭
    };
    var initialize = function () {
        var confirm01 = new AlertNew(defaults);
        return confirm01;
    };
    return {
        init: function (options) {
            jQuery.extend(defaults, options || {});
            return initialize();
        }
    }
});

Class('AlertNew', null, {
	AlertNew: function (options) {
        jQuery.extend(this, options);
        this.sure = options.sure || jQuery.noop;
        this.cancel = options.cancel || jQuery.noop;
        this.close = options.close || jQuery.noop;
        this.creatAlert();
    },
    creatAlert: function () {
        var Me = this;
        //检测背景层是否存在
        var oBg;
        var isIE = (document.all) ? true: false;
    	var isIE6 = isIE && ([/MSIE (\d)\.0/i.exec(navigator.userAgent)][0][1] == 6);
        oBg = jQuery("body").children(".sweet-alert-con");
        if (!oBg.length) {
            // 创建背景层
            oBg = document.createElement("div");
            document.body.appendChild(oBg);
            oBg.style.zIndex = "9998";
            oBg.className = "sweet-alert-con";
            oBg.setAttribute("id","layer");
            //oBg.style.display="block";
            oBg.style.opacity = "0.7";
            oBg.style.width = oBg.style.height = "100%";
            oBg.style.position = !isIE6 ? "fixed": "absolute";
            oBg.style.backgroundColor = "#000";
            oBg.style.top = oBg.style.left = 0;
        } else {
            oBg = oBg.get(0);
        }
        Me.oBg = oBg;
        // 创建弹出层
        var oAlert = document.createElement("div"), aHTML = [];
        oAlert.className="openWrap";
        //关闭按钮
      //  aHTML.push('<p class="opClose"><a href="#" class="tc-close close_btn"></a></p>');
     // 文本输入       
        // 判断是否需要居中显示
        var txt = Me.txt || Me.html, reg = /^(?:[^#<]*<[\w\W]+>)[^>]*jQuery/, isTXT = !reg.test(txt); //检测是否包含HTML
        // tit:标题, 关闭按钮
        aHTML.push('<div class="opCon"><div class="opTitle ft16"><p class="g_txt-c">' + txt + '</p></div>');
        aHTML.push('<div class="openWrapCont mt20">');
        
        
        aHTML.push('<p class="txt-c  mt20 clearfix">');
        if (!!Me.isBtn) {
            //取消
        	 aHTML.push('<a href="javascript:void(0);" class="w-btn-affirm w-btn-cannel ml20 btnCancel">取消</a>');
        	// 确定 btnSure
            aHTML.push('<a href="javascript:void(0);" class="w-btn-affirm w-btn-cd-qr ml20 btnSure">确认</a>');
           
           
        }
        aHTML.push('</p>');
        aHTML.push('</div></div>');
        oAlert.innerHTML = aHTML.join("");
        // 插入到body中
        document.body.appendChild(oAlert);
       // oBg.appendChild(oAlert);
        Me.oAlert = oAlert;
        var jQueryoAlert = jQuery(oAlert);
        //内容 jQuery(DOM Element)
        Me.context = jQueryoAlert.find(".pop_con");
        // 确定按钮
        Me.oSure = jQueryoAlert.find(".btnSure");
        // 取消按钮
        Me.oCancel = jQueryoAlert.find(".btnCancel");
        // 关闭按钮
        Me.oClose = jQueryoAlert.find(".close_btn");
        // 添加className
        oAlert.className = "openWrap mt20" + Me.addClass;

        //调整弹出框位置
        Me.onResize();
        Me.bindEvent();
        Me.callback && Me.callback.call(Me, Me.oAlert);
    },
    bindEvent: function () {
        var Me = this;
        Me.iTimer = null;
        // 确认
        this.oSure.click(function () {
        	Me.closeAlert();
            var ret;
            ret = Me.sure.call(Me, Me.oSure); //回调函数            
           /* if (ret !== false) {
                Me.closeAlert(); //关闭
            }*/
            return false;
        });
        // 取消 
        this.oCancel.click(function () {
            var ret;
            Me.isBg = true;
            ret = Me.cancel.call(Me, Me.oSure); //回调函数            
            if (ret !== false) {
                Me.closeAlert(); //关闭
            }
            return false;

        });
        // 关闭   
        this.oClose.click(function () {
            var ret;
            Me.isBg = true;
            ret = Me.close.call(Me, Me.oSure); //回调函数            
            if (ret !== false) {
                Me.closeAlert(); //关闭
            }
            return false;
        });
        if (Me.state === "alert") {
            Me.timer || (Me.timer = 3000);
            setTimeout(function () { if (Me.iTimer != null) { Me.closeAlert.call(Me) } }, Me.timer);
        }

        //窗口发生改变，触发onResize函数 调整弹出框
        jQuery(window).bind("resize", this.onResize);
    },
    onResize: function () {
        oAlert = this.oAlert;
        oAlert.style.zIndex = "9999";
        oAlert.style.display="block";
       // oAlert0=document.getElementsByClassName(".opCon");//this.oAlert.children(".opCon");
       // oAlert.style.left = (parseInt(document.documentElement.clientWidth || document.body.clientWidth)) / 2 + (document.documentElement.scrollLeft || document.body.scrollLeft) - oAlert.offsetWidth / 2 + "px";
       // oAlert.style.top = (parseInt(document.documentElement.clientHeight || document.body.clientHeight)) / 2 + (document.documentElement.scrollTop || document.body.scrollTop) - oAlert.offsetHeight / 2 + "px";
        oAlert.style.marginTop = -oAlert.offsetHeight / 2 + "px";
        oAlert.style.marginLeft = -oAlert.offsetWidth / 2 + "px";
        oAlert.style.top =oAlert.style.left = "50%";
    },
    closeAlert: function () {
        var Me = this;
        Me.iTimer = null;
        if (Me.isBg) {
            document.body.removeChild(Me.oBg); //删除节点   
        }
        document.body.removeChild(Me.oAlert); //删除节点
        return false;
    }
}, {});


