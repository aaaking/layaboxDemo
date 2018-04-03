/*
 * @author seacole
* WebService;
*/
var WebService = /** @class */ (function () {
    function WebService() {
    }
    /**
     * 调用API
     * @param module
     * @param action
     * @param callback
     * @param params
     * @param method
     */
    WebService.prototype.callApi = function (module, action, callback, params, method, header) {
        if (callback === void 0) { callback = null; }
        if (params === void 0) { params = null; }
        if (method === void 0) { method = 'post'; }
        if (header === void 0) { header = []; }
        if (!params) {
            params = {};
        }
        // let url: string = GameConfig.WEB_SERVICE_URL + '/' + module + '/' + action;
        // let m: Function = method == 'post' ? Ajax.POST : Ajax.GET;
        // let uid: string = GameLogic.userData.getItem('uid');
        // let token: string = GameLogic.userData.getItem('token');
        // if (uid)
        //     header.push("uid", uid);
        // if (token)
        //     header.push("tk", token);
        // header.push("os", Native.instance.OS);
        // m.call(Ajax, url, params, (content: any) => {
        //     log('get:' + content);
        //     if (callback) {
        //         let response: any = JSON.parse(content);
        //         if (response && response.hasOwnProperty("code") && response.code == 401) {
        //             console.warn("401");
        //             Dispatcher.dispatch(EventNames.UNAUTHORIZED);
        //         }
        //         else
        //             callback(response);
        //     }
        // }, null, header);
    };
    WebService.prototype.regist = function (uname, upwd, nickname, callback) {
        this.callApi('user', 'reg', function (response) {
            callback(response);
        }, { uname: uname, upwd: upwd, nickname: nickname });
    };
    return WebService;
}());
var webService = new WebService();
//# sourceMappingURL=WebService.js.map