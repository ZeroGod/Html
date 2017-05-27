(function ($) {
    var change = function (obj, tabs, divs) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i] == obj) {
                tabs[i].className = "fli";
                divs[i].className = "fdiv";
            }
            else {
                tabs[i].className = "";
                divs[i].className = "";
            }
        }
    }
    $.fn.tabChange = function (options) {
        var defaults = {
            listDiv: '#tab_con'
        };
        var opts = $.extend(defaults, options);
        var tabs = $(this).find("ul li");
        var divs = $(defaults.listDiv).find("div");
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].onmouseover = function () { change(this, tabs, divs); }
        }
    };
})(jQuery);