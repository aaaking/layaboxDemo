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
var CardPackageCard = /** @class */ (function (_super) {
    __extends(CardPackageCard, _super);
    function CardPackageCard() {
        var _this = _super.call(this) || this;
        _this._labTest = new Laya.Label();
        _this._labTest.centerX = 0;
        _this._labTest.color = "#ff0000";
        _this._labTest.y = 100;
        _this.addChild(_this._labTest);
        _this._btnSell = new Laya.Button("menu/btn_sell.png");
        _this._btnSell.stateNum = 1;
        _this._btnSell.centerX = 0;
        _this._btnSell.bottom = 0;
        _this._btnSell.on(Laya.Event.CLICK, _this, _this.onTouch);
        _this.addChild(_this._btnSell);
        _this._labCount = new Laya.Label();
        _this._labCount.right = 20;
        _this._labCount.bottom = 20;
        _this._labCount.fontSize = 30;
        _this._labCount.color = "#ffffff";
        _this._labCount.stroke = 5;
        _this._labCount.strokeColor = "0000000";
        _this.addChild(_this._labCount);
        return _this;
    }
    CardPackageCard.prototype.updata = function () {
        _super.prototype.updata.call(this);
        this._mask.visible = false;
        if (this.dataSource) {
            this._labTest.text = this.dataSource.cfg.name;
            this._btnSell.visible = true;
        }
        else {
            this._labTest.text = "";
            this._btnSell.visible = false;
        }
        this._labCount.text = this.dataSource.count;
    };
    CardPackageCard.prototype.onTouch = function (e) {
        Dispatcher.dispatch("showSellCards", this.dataSource);
    };
    return CardPackageCard;
}(Card));
//# sourceMappingURL=CardPackageCard.js.map