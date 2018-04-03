var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
* name;
*/
var SceneLogin = /** @class */ (function (_super) {
    __extends(SceneLogin, _super);
    function SceneLogin() {
        var _this = _super.call(this) || this;
        Laya.stage.on(Laya.Event.RESIZE, _this, _this.onResize);
        _this._btnLogin.on(Laya.Event.CLICK, _this, _this.onTouch);
        return _this;
    }
    Object.defineProperty(SceneLogin, "instance", {
        get: function () {
            localStorage.removeItem("uuid");
            if (!this._instance)
                this._instance = new SceneLogin();
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    SceneLogin.prototype.show = function () {
        this.onResize();
        Laya.stage.addChild(SceneLogin.instance);
    };
    SceneLogin.prototype.onTouch = function (e) {
        switch (e.currentTarget) {
            case this._btnLogin:
                Laya.stage.removeChildren();
                var uuid = localStorage.getItem('uuid');
                if (!uuid) {
                    Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "personal_newAccount", "params": [""], "id": 67 }, "POST", null, function (data) {
                        console.info(data);
                        var info = JSON.parse(data);
                        localStorage.setItem('uuid', info.result);
                        SceneMenu.instance.show();
                        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "personal_unlockAccount", "params": [GameConfig.BASE_COIN, GameConfig.BASE_PASS, null], "id": 67 }, "POST", null, function (data) {
                            console.info(data);
                            var info = JSON.parse(data);
                            if (info.result) {
                                Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_sendTransaction", "params": [{ "from": GameConfig.BASE_COIN, "to": localStorage.getItem('uuid'), "value": "0x4563918244F40000" }], "id": 67 }, "POST", null, function (data) {
                                    console.info(data);
                                });
                            }
                        });
                    }.bind(this));
                }
                else {
                    SceneMenu.instance.show();
                }
                break;
        }
    };
    SceneLogin.prototype.onResize = function (e) {
        if (e === void 0) { e = null; }
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    };
    /**
* 获取设备唯一ID
* @param callback
* @param prefix
* @param makeNew
*/
    SceneLogin.prototype.getDeviceUUID = function () {
        var uuid = localStorage.getItem('uuid');
        if (!uuid) {
            uuid = StringUtils.makeRandomString(32);
            localStorage.setItem('uuid', uuid);
        }
        return uuid;
    };
    return SceneLogin;
}(ui.scene.SceneLoginUI));
//# sourceMappingURL=SceneLogin.js.map