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
var CardPackage = /** @class */ (function (_super) {
    __extends(CardPackage, _super);
    function CardPackage() {
        var _this = _super.call(this) || this;
        _this._mask.width = Laya.stage.width;
        _this._mask.height = Laya.stage.height;
        _this._mask.on(Laya.Event.CLICK, _this, _this.onTouch);
        _this._btnBack.on(Laya.Event.CLICK, _this, _this.onTouch);
        _this._btnSortNormal.on(Laya.Event.CLICK, _this, _this.onTouch);
        _this._btnSortCamp.on(Laya.Event.CLICK, _this, _this.onTouch);
        Laya.stage.on(Laya.Event.RESIZE, _this, _this.onResize);
        Dispatcher.on("showSellCards", _this, _this.onShowSellCards);
        Dispatcher.on("updateBag", _this, _this.updateBag);
        return _this;
    }
    Object.defineProperty(CardPackage, "instance", {
        get: function () {
            if (!this._instance)
                this._instance = new CardPackage();
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    CardPackage.prototype.show = function (parent) {
        var _this = this;
        if (parent && !CardPackage.instance.parent)
            parent.addChild(CardPackage.instance);
        CardPackageManager.instance.testInitCards(function () {
            _this._list.itemRender = CardPackageCard;
            // this._list.scrollBar.elasticDistance = 20;
            _this._list.scrollBar.visible = false;
            _this._list.renderHandler = new Laya.Handler(_this, _this.updateList);
            _this._list.array = CardPackageManager.instance.cards;
            // this._ui._list.array = ClubManager.myClubs;
            // this._list.mouseHandler = new Laya.Handler(this, this.selectList);
            _this.onResize(null);
        });
    };
    CardPackage.prototype.updateBag = function () {
        var _this = this;
        CardPackageManager.instance.testInitCards(function () {
            _this._list.array = CardPackageManager.instance.cards;
        });
    };
    CardPackage.prototype.onTouch = function (e) {
        switch (e.currentTarget) {
            case this._btnBack:
                this.removeSelf();
                break;
            case this._btnSortNormal:
                this.setList(0);
                break;
            case this._btnSortCamp:
                this.setList(1);
                break;
        }
    };
    CardPackage.prototype.setList = function (type) {
        this._sortType = type;
        switch (this._sortType) {
            case 0:
                this._list.array = CardPackageManager.instance.cards;
                break;
            case 1:
                this.setCamp();
                break;
        }
    };
    CardPackage.prototype.setCamp = function () {
        var camp = CardPackageManager.instance.sortOnCampCards;
        var currCamp = 1;
        var count = 0;
        var tmp;
        for (var i = 0; i < camp.length;) {
            if (camp[i].cfg.camp == currCamp) {
                count++;
                i++;
            }
            else {
                currCamp++;
                tmp = count % (this._columeCount + 1);
                if (tmp != 0)
                    tmp = this._columeCount + 1 - tmp;
                count = 0;
                for (var j = 0; j < tmp; j++, i++) {
                    camp.splice(i, 0, null);
                }
            }
        }
        this._list.array = camp;
    };
    /***渲染单元格时的回调方法***/
    CardPackage.prototype.updateList = function (cell, index) {
        cell.updata();
    };
    CardPackage.prototype.onShowSellCards = function (data) {
        SellCard.instance.show(this, data);
    };
    CardPackage.prototype.onResize = function (e) {
        if (e === void 0) { e = null; }
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this._columeCount = Math.floor((this.width - 190 - 196) / (196 + 28));
        this._list.scrollBar.value = 0;
        this._list.width = (196 + 28) * this._columeCount + 196;
        this._list.x = this.width - this._list.width >> 1;
        this.setList(this._sortType);
    };
    return CardPackage;
}(ui.cardPackage.CardPackageUI));
//# sourceMappingURL=CardPackage.js.map