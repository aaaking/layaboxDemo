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
var SceneMenu = /** @class */ (function (_super) {
    __extends(SceneMenu, _super);
    function SceneMenu() {
        var _this = _super.call(this) || this;
        Laya.stage.on(Laya.Event.RESIZE, _this, _this.onResize);
        _this._btnWarehouse.on(Laya.Event.CLICK, _this, _this.onTouch);
        _this._btnCardPackage.on(Laya.Event.CLICK, _this, _this.onTouch);
        _this._btnShowcard.on(Laya.Event.CLICK, _this, _this.onTouch);
        _this._btnBankExchange.on(Laya.Event.CLICK, _this, _this.onTouch);
        return _this;
    }
    Object.defineProperty(SceneMenu, "instance", {
        get: function () {
            if (!this._instance)
                this._instance = new SceneMenu();
            return this._instance;
        },
        enumerable: true,
        configurable: true
    });
    SceneMenu.prototype.show = function () {
        this.onResize();
        Laya.stage.addChild(SceneMenu.instance);
        CardPackageManager.instance.testInitCards(function () {
        });
    };
    SceneMenu.prototype.onTouch = function (e) {
        switch (e.currentTarget) {
            case this._btnWarehouse:
                Warehouse.instance.show(this);
                break;
            case this._btnCardPackage:
                CardPackage.instance.show(this);
                break;
            case this._btnShowcard:
                ShowCard.instance.show(this);
                break;
            case this._btnBankExchange:
                Exchange.instance.show(this);
                break;
        }
    };
    SceneMenu.prototype.onResize = function (e) {
        if (e === void 0) { e = null; }
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    };
    return SceneMenu;
}(ui.scene.SceneMenuUI));
//# sourceMappingURL=SceneMenu.js.map