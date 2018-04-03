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
var SellCard = /** @class */ (function (_super) {
    __extends(SellCard, _super);
    function SellCard() {
        var _this = _super.call(this) || this;
        _this._mask.on(Laya.Event.CLICK, _this, _this.onTouch);
        _this._btnClose.on(Laya.Event.CLICK, _this, _this.onTouch);
        _this._btnConfirm.on(Laya.Event.CLICK, _this, _this.onTouch);
        return _this;
    }
    Object.defineProperty(SellCard, "instance", {
        get: function () {
            if (!this._instance)
                this._instance = new SellCard();
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    SellCard.prototype.show = function (parent, data) {
        if (parent && !SellCard.instance.parent)
            parent.addChild(SellCard.instance);
        this._data = data;
        this._imgIcon.skin = "cards/" + this._data.cfg.icon + ".png";
        this._input.text = "";
        this._labTip.visible = this._boxWaiting.visible = false;
        this._boxNormal.mouseEnabled = true;
        Laya.Tween.clearTween(this._labTip);
        Laya.Tween.clearTween(this._boxWaiting);
        Laya.timer.clearAll(this);
        this.onResize(null);
    };
    SellCard.prototype.onTouch = function (e) {
        switch (e.currentTarget) {
            case this._btnClose:
                this.removeSelf();
                break;
            case this._btnConfirm:
                this.sell();
                break;
        }
    };
    SellCard.prototype.onResize = function (e) {
        if (e === void 0) { e = null; }
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    };
    SellCard.prototype.sell = function () {
        var _this = this;
        var baseID = "0000000000000000000000000000000000000000000000000000000000000000";
        var baseCount = "0000000000000000000000000000000000000000000000000000000000000000";
        if (this._input.text == "") {
            Laya.Tween.clearTween(this._labTip);
            this._labTip.visible = true;
            this._labTip.alpha = 0;
            Laya.Tween.to(this._labTip, { alpha: 1 }, 500, null, Laya.Handler.create(this, function () {
                Laya.Tween.to(_this._labTip, { alpha: 0 }, 500, null, null, 1000);
            }));
        }
        else {
            this._boxNormal.mouseEnabled = false;
            this._boxWaiting.visible = true;
            this._boxWaiting.alpha = 0;
            var count = parseInt(this._input.text);
            console.log(this._data.id.toString(16));
            console.log(count.toString(16).length);
            console.log(baseCount.substring(0, 64 - this._data.id.toString(16).length) + this._data.id.toString(16));
            var idstr = baseCount.substring(0, 64 - this._data.id.toString(16).length) + this._data.id.toString(16);
            console.log(count.toString(16));
            console.log(count.toString(16).length);
            console.log(baseCount.substring(0, 64 - count.toString(16).length) + count.toString(16));
            var countstr = baseCount.substring(0, 64 - count.toString(16).length) + count.toString(16);
            var param_1 = String(idstr) + String(countstr);
            console.log(param_1);
            Laya.Tween.to(this._boxWaiting, { alpha: 1 }, 500, null);
            // Laya.timer.once(5000, this, () => {
            //     this._boxNormal.mouseEnabled = true;
            //     this._boxWaiting.visible = false;
            // })
            Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "personal_unlockAccount", "params": [localStorage.getItem('uuid'), "", null
                ], "id": 67 }, "POST", null, function (data) {
                console.info(data);
                Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_sendTransaction", "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0x95bf05a4" + param_1 }], "id": 67 }, "POST", null, function (data) {
                    console.info(data);
                    var info = JSON.parse(data);
                    Laya.timer.loop(10000, this, function () {
                        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_getTransactionReceipt", "params": [info.result], "id": 67 }, "POST", null, function (data) {
                            console.info(data);
                            var cardsinfo = JSON.parse(data);
                            if (cardsinfo.result) {
                                Laya.timer.clearAll(this);
                                this._boxNormal.mouseEnabled = true;
                                // this.showCard(id);
                                this._boxWaiting.visible = false;
                                this.removeSelf();
                                Dispatcher.dispatch("updateBag");
                            }
                        }.bind(this));
                    });
                }.bind(this));
            }.bind(this));
        }
    };
    return SellCard;
}(ui.cardPackage.SellCardUI));
//# sourceMappingURL=SellCard.js.map