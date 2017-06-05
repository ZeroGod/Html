/**
 * Author:zhouxiong
 * CreateTime:2017-05-12
 * QQ:978133539   
 * Email:zhouxiong@zhongjiu.cn 
 */

//定义对象
var zhongjiu = window.zhongjiu || {};
zhongjiu.integral = zhongjiu.integral || {};
zhongjiu.integral.getintegral = (function () {
    var defaults = {
        pageIndex: 1,//当前页序号
        boxCollection: 'showDiv0',//填充html盒子
        infoUrl: "data.json",//请求地址
        methName: "RankListMonth",//方法名
        interId: 0,
        storeId: 0,
        dir: 0,
        preDir: 0,//当前导航之前的导航的方向
        id: 0,
        pageUrl: "",
        count: 1,//请求数
        loading: false,//加载情况，防止多次加载
        myScroll: null,
        mySwiper: null

    };

    function bindData() {
        var pullDown, pullUp;
        //下拉刷新
        function pullDownAction() {
            defaults.pageIndex = 1;
            defaults.count = 1;
            $("." + defaults.boxCollection).empty();
            defaults.loading = false;
            getData();

        }
        //上拉加载
        function pullUpAction() {
            if (defaults.count > 10) {
                defaults.myScroll.refresh();
                return;
            }
            if (defaults.loading) {
                defaults.myScroll.refresh();
                return;
            }
            defaults.loading = true;
            getData();
        }
        function Download() {
            setTimeout(function () {
                pullDownAction();
            }, 1000);

        }
        function Upload() {
            setTimeout(function () {
                pullUpAction();
            }, 1000);
        }
        pullDown = document.getElementById('pullDown'), pullUp = document.getElementById('pullUp'), bob = null, isMove = null;
        defaults.myScroll = new iScroll('wrapperscroll', {
            useTransition: true, momentum: true,
            hideScrollbar: true,
            fadeScrollbar: true,
            onRefresh: function () {
                pullDown.className = '';
                pullDown.innerHTML = '';
                pullUp.className = '';
                pullUp.innerHTML = '';
            },
            onScrollMove: function (e) {
                switch (true) {
                    case this.y > 40:
                        pullDown.innerHTML = '释放后刷新';
                        pullUp.innerHTML = '';
                        pullDown.className = 'loading';
                        pullUp.className = '';
                        bob = 1;
                        isMove = this.y - 30;
                        break;
                    case this.y < -30:
                        if (defaults.pageIndex < 10) {
                            pullUp.innerHTML = '释放后加载';
                            pullDown.innerHTML = '';
                            pullUp.className = 'loading';
                            pullDown.className = '';
                            bob = 2;
                            isMove = this.y - 30;
                        }
                        break;
                    default:
                        bob = 3;
                }

            },
            onScrollEnd: function () {
                switch (bob) {
                    case 1:
                        if (isMove > 10) {
                            pullDown.className = 'loading';
                            pullDown.innerHTML = '刷新中...';
                            pullUp.className = '';
                            pullUp.innerHTML = '';
                            Download();

                        } else {
                            pullDown.className = '';
                            pullDown.innerHTML = '';
                            pullUp.className = '';
                            pullUp.innerHTML = '';
                        }
                        break;
                    case 2:
                        if (isMove < this.maxScrollY - 60) {
                            pullUp.className = 'loading';
                            pullUp.innerHTML = '加载中...';
                            pullDown.className = '';
                            pullDown.innerHTML = '';
                            Upload();
                        } else {
                            pullDown.className = '';
                            pullDown.innerHTML = '';
                            pullUp.className = '';
                            pullUp.innerHTML = '';
                        }
                        break;
                    default:
                        pullDown.className = '';
                        pullDown.innerHTML = '';
                        pullUp.className = '';
                        pullUp.innerHTML = '';
                }
                isMove = null;
            }

        });

        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
        defaults.mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            observer: true,
            observeParents: true,
            // pagination: '.swiper-pagination',
            onTransitionEnd: function (swiper) {
                //禁止没有滑动到新的导航时，触发加载事件
                if (defaults.mySwiper.activeIndex != defaults.preDir) {
                    defaults.myScroll.scrollTo(0, 0);//重置位置，防止下拉加载也执行
                    defaults.myScroll.refresh();//滚动更新
                    $('.showDiv0').empty();
                    $('.showDiv1').empty();
                    $('.subNav').removeClass("cur");
                    $('.subNav').eq(defaults.mySwiper.activeIndex).addClass('cur');
                    defaults.pageIndex = 1;
                    defaults.dir = defaults.mySwiper.activeIndex;
                    defaults.preDir = defaults.mySwiper.activeIndex;
                    if (defaults.mySwiper.activeIndex == 1) {
                        defaults.boxCollection = "showDiv1";
                    } else {
                        defaults.boxCollection = "showDiv0";
                    }
                    defaults.count = 1;
                    getData();
                }
            }
        });
        //首次加载页面调用方法
        pullDownAction();

    }

    //调用地址，获取数据
    function getData() {
        $.ajax({
            type: "GET",
            url: defaults.infoUrl,
            dataType: "json",
            data: { "methodname": defaults.methName, "p": defaults.pageIndex, "dir": defaults.dir },
            success: function (data) {
                switch (defaults.methName) {
                    case "RankListMonth":
                        userIntegral(data);
                        break;
                    default:;
                }
            },
            complete: function (XMLHttpRequest, textStatus) {
                defaults.myScroll.refresh();
            },
            error: function (errorStatus) {
                defaults.myScroll.refresh();
            }
        });
    }


    //拼接html到页面
    function userIntegral(json) {
        var data = json;
        if (data.virtualData.length > 0) {
            if ($(".noIntegral").length > 0) {
                $(".noIntegral").remove();
            }
            $.each(data.virtualData, function (i, n) {
                if (i < 3) {
                    var str = "  <div class='yhj-item ft14'>\
                    <div class='title'>\
                    <p>楼兰酒庄可用</p>\
                    </div>\
                    <div class='yhj-detail'>\
                    <h3>￥300</h3>\
                    <p>【满1000元可用】</p>\
                    <p>使用期限：2017.05.15-2017.05.31</p>\
                    </div>\
                    </div>";
                    $("." + defaults.boxCollection).append(str);
                }
            });
        } else {
            //首次加载，如果没有积分记录，显示提示信息
            if (defaults.count === 1) {
                if ($(".noIntegral").length === 0) {
                    $("." + defaults.boxCollection).append("<div class='ft14 noIntegral' style='padding-bottom:20px;margin-top:20px;'>暂无积分记录</div>");
                }
            }
        }
        defaults.loading = false;
        defaults.count++;
        defaults.pageIndex++;
    }

    var initialize = function () {
        bindData();
        $(".subNav").click(function () {
            var direction = $(this).attr("direction");
            defaults.mySwiper.slideTo(direction, 500);
        });
    };
    return {
        init: function (options) {
            jQuery.extend(defaults, options || {});
            initialize();
        }
    };
});



