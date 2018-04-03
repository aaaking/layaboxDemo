/**
 * @author seacole *
 * Ajax异步请求
 */
var Ajax = /** @class */ (function () {
    function Ajax() {
    }
    Ajax.callNet = function (url, params, method, header, onSuccess, onError, responseType) {
        if (params === void 0) { params = null; }
        if (method === void 0) { method = "get"; }
        if (header === void 0) { header = null; }
        if (onSuccess === void 0) { onSuccess = null; }
        if (onError === void 0) { onError = null; }
        if (responseType === void 0) { responseType = "text"; }
        var request = new Laya.HttpRequest();
        request.on(Laya.Event.COMPLETE, this, function (event) {
            if (onSuccess) {
                onSuccess(request.data);
            }
        });
        request.on(Laya.Event.ERROR, this, function (event) {
            if (onError) {
                onError(request.data);
            }
        });
        request.on(Laya.Event.PROGRESS, this, function (event) {
        });
        if (!header)
            header = [];
        var data;
        if (method == "get") {
            header.push("Content-Type", "application/x-www-form-urlencoded");
            data = Utils.obj2query(params);
            if (data)
                url += "?" + data;
            request.send(url, null, method, responseType, header);
            console.log(method + " " + url);
        }
        else {
            if (params)
                data = JSON.stringify(params);
            header.push("Content-Type", "application/json");
            request.send(url, data, method, responseType, header);
            console.log(method + " " + url + "?" + data);
        }
    };
    Ajax.GET = function (url, params, onSuccess, onError, header) {
        if (params === void 0) { params = null; }
        if (onSuccess === void 0) { onSuccess = null; }
        if (onError === void 0) { onError = null; }
        if (header === void 0) { header = null; }
        this.callNet(url, params, 'get', header, onSuccess, onError);
    };
    Ajax.POST = function (url, params, onSuccess, onError, header) {
        if (params === void 0) { params = null; }
        if (onSuccess === void 0) { onSuccess = null; }
        if (onError === void 0) { onError = null; }
        if (header === void 0) { header = null; }
        this.callNet(url, params, 'post', header, onSuccess, onError);
    };
    return Ajax;
}());
//# sourceMappingURL=Ajax.js.map