(function ($) {
    var change = function (obj, tabs) {
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i] == obj) {
                tabs[i].className = "fli";
                $(tabs[i]).find("div")[0].className = "fdiv";
            }
            else {
                tabs[i].className = "";
                $(tabs[i]).find("div")[0].className = "";
            }
        }
    }
    $.fn.tabChange = function (options) {
        var defaults = {
            listDiv: '#tab'
        };
        var opts = $.extend(defaults, options);
        var tabs = $(this).find("ul li");
        for (var i = 0; i < tabs.length; i++) {
            tabs[i].onclick = function () { change(this, tabs); }
        }
    };
})(jQuery);