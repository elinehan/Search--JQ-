/**
 * Created by hWX392411 on 2016/8/29.
 */
(function (window,$,er) {

    var oldAjax;
    if ($ && $.ajax){
        oldAjax=$.ajax;
    }

    var AjaxRequest = function (option) {

        var xhr = null;

        var oldError=option.error;
        option.error = function (e, f, errorThrown) {
            var errorCC;
            if(errorCC = (option.errorCC || er)){
                for(var key in errorCC){
                    if (e && (e.status == key)){
                        errorCC[key]();
                    }
                }
            };

            if (oldError){
                oldError();
            }
        };

        xhr = oldAjax(option);
        return xhr;
    };

    window.Util={
        Url: {
            Host: window.location.host,
            HostName: window.location.hostname,
            PathName: window.location.pathname,
            Port: window.location.port,
            Search: window.location.search,
            Href: window.location.href,
            Protocol: window.location.protocol,
            Segments: window.location.pathname.replace(/^\//, '').split('/'),
            GetQueryValue: function (name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r) {
                    return decodeURI(r[2]);
                }
                return null;
            },
            GetParams: function () {
                var url = window.location.search; //获取url中"?"符后的字串
                var params = new Object();
                if (url.indexOf("?") != -1) {
                    var str = url.substr(1);
                    strs = str.split("&");
                    for (var i = 0; i < strs.length; i++) {
                        params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
                    }
                }
                return params;
            },
            Go: function (url, target) {
                target = target || "_blank";
                var ele = document.createElement("a");
                ele.setAttribute("href", encodeURI(url));
                ele.setAttribute("style", "display:none;");
                ele.setAttribute("target", target);
                if (!ele.click) {
                    var evt = document.createEvent("MouseEvents");
                    evt.initEvent("click", true, true);
                    ele.dispatchEvent(evt);
                }
                document.body.appendChild(ele);
                ele.click();
                document.body.removeChild(ele);
            }
        }
    }

    window.$.ajax = AjaxRequest;
})(window,jQuery,{
    /*404:function () {
        alert("404!");
    },
    10001:function () {
        alert("超时!");
    }*/
});