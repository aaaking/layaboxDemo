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
var WareHouseCard = /** @class */ (function (_super) {
    __extends(WareHouseCard, _super);
    function WareHouseCard() {
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
        return _this;
    }
    WareHouseCard.prototype.updata = function () {
        _super.prototype.updata.call(this);
        this._icon.skin = "cards/" + this.dataSource.cfg.icon + ".png";
        this._imgName.skin = "cardsname/" + this.dataSource.cfg.icon + ".png";
        if (this.dataSource.isHave) {
            this._mask.visible = false;
        }
        else {
            this._mask.visible = true;
        }
        this._labCount.text = this.dataSource.count;
    };
    return WareHouseCard;
}(Card));
//# sourceMappingURL=WareHouseCard.js.map