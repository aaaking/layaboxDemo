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
var Warehouse = /** @class */ (function (_super) {
    __extends(Warehouse, _super);
    function Warehouse() {
        var _this = _super.call(this) || this;
        _this._names = ["魏", "蜀", "吴", "群", "全部"];
        _this._mask.width = Laya.stage.width;
        _this._mask.height = Laya.stage.height;
        _this._mask.on(Laya.Event.CLICK, _this, _this.onTouch);
        _this._btnBack.on(Laya.Event.CLICK, _this, _this.onTouch);
        Laya.stage.on(Laya.Event.RESIZE, _this, _this.onResize);
        _this._tab.removeChildren();
        _this._tab.initItems();
        for (var i = 0; i < 5; i++) {
            var btn = new Laya.Button();
            btn.skin = "menu/btn_4.png";
            btn.stateNum = 2;
            btn.label = _this._names[i];
            btn.labelColors = "#e2eff7,#e2eff7,#e2eff7,#e2eff7";
            btn.labelSize = 30;
            btn.name = "item" + i;
            _this._tab.addItem(btn);
            btn.x = 0;
            btn.y = 99 * i;
        }
        _this._tab.selectHandler = new Laya.Handler(_this, _this.checkTab);
        _this._tab.selectedIndex = 4;
        _this.checkTab();
        return _this;
    }
    Object.defineProperty(Warehouse, "instance", {
        get: function () {
            if (!this._instance)
                this._instance = new Warehouse();
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    Warehouse.prototype.show = function (parent) {
        var _this = this;
        if (parent && !Warehouse.instance.parent)
            parent.addChild(Warehouse.instance);
        WareHouseManager.instance.testInitCards(function () {
            _this._list.itemRender = WareHouseCard;
            // this._list.scrollBar.elasticDistance = 20;
            _this._list.scrollBar.visible = false;
            _this._list.renderHandler = new Laya.Handler(_this, _this.updateList);
            _this._list.array = WareHouseManager.instance.cards;
            // this._ui._list.array = ClubManager.myClubs;
            // this._list.mouseHandler = new Laya.Handler(this, this.selectList);
            _this.onResize(null);
        });
    };
    Warehouse.prototype.onTouch = function (e) {
        switch (e.currentTarget) {
            case this._btnBack:
                this.removeSelf();
                break;
        }
    };
    Warehouse.prototype.setList = function (camp) {
        this._list.array = WareHouseManager.instance.getCardsByCamp(camp);
    };
    /***渲染单元格时的回调方法***/
    Warehouse.prototype.updateList = function (cell, index) {
        cell.updata();
    };
    Warehouse.prototype.onResize = function (e) {
        if (e === void 0) { e = null; }
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        var tmp = Math.floor((this.width - 190 - 196) / (196 + 28));
        this._list.width = (196 + 28) * tmp + 196;
        this._list.x = this.width - this._list.width >> 1;
    };
    Warehouse.prototype.checkTab = function () {
        this.setList(this._tab.selectedIndex + 1);
    };
    return Warehouse;
}(ui.warehouse.WarehouseUI));
//# sourceMappingURL=Warehouse.js.map