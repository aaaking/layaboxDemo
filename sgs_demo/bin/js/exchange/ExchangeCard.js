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
var ExchangeCard = /** @class */ (function (_super) {
    __extends(ExchangeCard, _super);
    function ExchangeCard() {
        var _this = _super.call(this) || this;
        _this._imgName = new Laya.Image();
        _this._imgName.pos(14, 70);
        _this.addChild(_this._imgName);
        _this._labCount = new Laya.Label();
        _this._labCount.right = 20;
        _this._labCount.bottom = 20;
        _this._labCount.fontSize = 30;
        _this._labCount.color = "#ffffff";
        _this._labCount.stroke = 5;
        _this._labCount.strokeColor = "0000000";
        _this.addChild(_this._labCount);
        _this._btnBuy = new Laya.Button("menu/btn_buy.png");
        _this._btnBuy.stateNum = 1;
        _this.addChild(_this._btnBuy);
        _this._btnBuy.centerX = 0;
        _this._btnBuy.y = 282;
        _this.height = 360;
        _this._labPrice = new Laya.Label("200");
        _this._btnBuy.addChild(_this._labPrice);
        _this._labPrice.color = "#ffffff";
        _this._labPrice.fontSize = 20;
        _this._labPrice.stroke = 2;
        _this._labPrice.strokeColor = "#000000";
        _this._labPrice.pos(80, 30);
        _this._btnBuy.on(Laya.Event.CLICK, _this, _this.buyCard);
        return _this;
    }
    ExchangeCard.prototype.updata = function () {
        _super.prototype.updata.call(this);
        this._icon.skin = "cards/" + this.dataSource.cfg.icon + ".png";
        this._imgName.visible = true;
        this._imgName.skin = "cardsname/" + this.dataSource.cfg.icon + ".png";
        this._labPrice.text = this.dataSource.price;
        if (this.dataSource.isself) {
            this._btnBuy.skin = "menu/btn_cancel.png";
            this._labPrice.visible = false;
        }
        else {
            this._btnBuy.skin = "menu/btn_buy.png";
        }
    };
    ExchangeCard.prototype.buyCard = function () {
        var baseID = "0000000000000000000000000000000000000000000000000000000000000000";
        var param = baseID.substring(0, 64 - this.dataSource.id.toString(16).length) + this.dataSource.id.toString(16);
        Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "personal_unlockAccount", "params": [localStorage.getItem('uuid'), "", null
            ], "id": 67 }, "POST", null, function (data) {
            console.info(data);
            Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_sendTransaction", "params": [{ "from": localStorage.getItem('uuid'), "to": GameConfig.RPC_ADDRESS, "data": "0xc70f5eaa" + param, "value": "0x" + parseInt(this.dataSource.price).toString(16) }], "id": 67 }, "POST", null, function (data) {
                console.info(data);
                var info = JSON.parse(data);
                Laya.timer.loop(10000, this, function () {
                    Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": "eth_getTransactionReceipt", "params": [info.result], "id": 67 }, "POST", null, function (data) {
                        console.info(data);
                        var cardsinfo = JSON.parse(data);
                        if (cardsinfo.result) {
                            Laya.timer.clearAll(this);
                            Dispatcher.dispatch("updateInfo");
                        }
                    }.bind(this));
                });
            }.bind(this));
        }.bind(this));
    };
    return ExchangeCard;
}(Card));
//# sourceMappingURL=ExchangeCard.js.map