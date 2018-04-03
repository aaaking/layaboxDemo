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
var ShowCard = /** @class */ (function (_super) {
    __extends(ShowCard, _super);
    function ShowCard() {
        var _this = _super.call(this) || this;
        _this._mask.width = Laya.stage.width;
        _this._mask.height = Laya.stage.height;
        _this._mask.on(Laya.Event.CLICK, _this, _this.onTouch);
        _this._btnOpen.on(Laya.Event.CLICK, _this, _this.onTouch);
        _this._btnBack.on(Laya.Event.CLICK, _this, _this.onTouch);
        Laya.stage.on(Laya.Event.RESIZE, _this, _this.onResize);
        return _this;
    }
    Object.defineProperty(ShowCard, "instance", {
        get: function () {
            if (!this._instance)
                this._instance = new ShowCard();
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    ShowCard.prototype.show = function (parent) {
        if (parent && !ShowCard.instance.parent)
            parent.addChild(ShowCard.instance);
        this.mouseEnabled = true;
        Laya.Tween.clearAll(this._boxWaiting);
        Laya.Tween.clearAll(this._labTip);
        Laya.timer.clearAll(this);
        this._btnOpen.visible = this._imgBg.visible = true;
        this._imgIcon.visible = this._labTip.visible = this._boxWaiting.visible = false;
        this.off(Laya.Event.CLICK, this, this.onTouch);
        this.onResize(null);
    };
    ShowCard.prototype.toAscii = function (hex) {
        // Find termination
        var str = "";
        var i = 0, l = hex.length;
        if (hex.substring(0, 2) === '0x') {
            i = 2;
        }
        for (; i < l; i += 2) {
            var code = parseInt(hex.substr(i, 2), 16);
            str += String.fromCharCode(code);
        }
        return str;
    };
    ;
    ShowCard.prototype.onTouch = function (e) {
        switch (e.currentTarget) {
            case this._btnBack:
                this.removeSelf();
                e.stopPropagation();
                break;
            case this._btnOpen:
                this.mouseEnabled = false;
                this._boxWaiting.visible = true;
                this._boxWaiting.alpha = 0;
                Laya.Tween.to(this._boxWaiting, { alpha: 1 }, 500, null);
                // Laya.timer.once(5000, this, () => {
                //     this.mouseEnabled = true;
                //     var id: number = this.testOpenCard();
                //     this.showCard(id);
                //     this._boxWaiting.visible = false;
                // })
                Laya.timer.loop(5000, this, function () {
                });
                e.stopPropagation();
                Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "personal_unlockAccount", "params": [localStorage.getItem('uuid'), "", null
                    ], "id": 67 }, "POST", null, function (data) {
                    console.info(data);
                    if (JSON.parse(data).result) {
                        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_sendTransaction", "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x62158099", "value": "0x20" }], "id": 67 }, "POST", null, function (data) {
                            console.info(data);
                            var info = JSON.parse(data);
                            if (info.error) {
                                this._wait.text = "交易失败";
                                Laya.timer.once(2000, this, function () {
                                    this.mouseEnabled = true;
                                    // this.showCard(id);
                                    this._boxWaiting.visible = false;
                                });
                            }
                            else {
                                this._wait.text = "正在开卡中请等待...";
                                Laya.timer.loop(10000, this, function () {
                                    Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_getTransactionReceipt", "params": [info.result], "id": 67 }, "POST", null, function (data) {
                                        console.info(data);
                                        var cardsinfo = JSON.parse(data);
                                        if (cardsinfo.result) {
                                            Laya.timer.clearAll(this);
                                            this.mouseEnabled = true;
                                            // this.showCard(id);
                                            this._boxWaiting.visible = false;
                                            Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_call", "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x179a074f" }, "latest"], "id": 67 }, "POST", null, function (data) {
                                                console.info(data);
                                                var info = JSON.parse(data);
                                                var result = info.result.substring(130);
                                                result = "0x" + result;
                                                var result1 = this.toAscii(result);
                                                var cards = result1.split(",");
                                                cards.pop();
                                                for (var k in cards) {
                                                    var v = cards[k];
                                                    var arr = v.split(":");
                                                    var id = parseInt(arr[0]);
                                                    var cfg = GameConfig.getCfgHeroById(id);
                                                    var count = arr[1];
                                                    if (parseInt(count) > 0) {
                                                        if (CardPackageManager.instance.getCountByID(id) >= 0) {
                                                            if (parseInt(count) - CardPackageManager.instance.getCountByID(id) == 1) {
                                                                this.showCard(id);
                                                                CardPackageManager.instance.addCountByID(id);
                                                                break;
                                                            }
                                                        }
                                                        // }else{
                                                        //     this.showCard(id);
                                                        //     break
                                                        // }
                                                    }
                                                }
                                            }.bind(this));
                                        }
                                    }.bind(this));
                                });
                            }
                        }.bind(this));
                    }
                }.bind(this));
                break;
            case this:
                Laya.Tween.clearAll(this._labTip);
                this.off(Laya.Event.CLICK, this, this.onTouch);
                this._btnOpen.visible = this._imgBg.visible = true;
                this._imgIcon.visible = this._labTip.visible = false;
                break;
        }
    };
    ShowCard.prototype.onResize = function (e) {
        if (e === void 0) { e = null; }
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    };
    ShowCard.prototype.testOpenCard = function () {
        return Math.floor(Math.random() * 25) + 0;
    };
    ShowCard.prototype.showCard = function (id) {
        var _this = this;
        var cfg = GameConfig.getCfgHeroById(id);
        this._imgIcon.skin = "showcards/" + cfg.icon + ".png";
        this._btnOpen.visible = this._imgBg.visible = false;
        this._imgIcon.visible = true;
        Laya.timer.once(1000, this, function () {
            _this._labTip.visible = true;
            _this.on(Laya.Event.CLICK, _this, _this.onTouch);
        });
    };
    return ShowCard;
}(ui.showcard.ShowCardUI));
//# sourceMappingURL=ShowCard.js.map