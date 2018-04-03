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
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var cardPackage;
    (function (cardPackage) {
        var CardPackageUI = /** @class */ (function (_super) {
            __extends(CardPackageUI, _super);
            function CardPackageUI() {
                return _super.call(this) || this;
            }
            CardPackageUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.cardPackage.CardPackageUI.uiView);
            };
            CardPackageUI.uiView = { "type": "View", "props": { "width": 1280, "height": 400 }, "child": [{ "type": "Image", "props": { "y": 10, "x": 10, "var": "_mask", "top": 0, "skin": "comp/blank.png", "right": 0, "mouseThrough": false, "mouseEnabled": true, "left": 0, "bottom": 0 } }, { "type": "Image", "props": { "skin": "menu/bg.jpg" } }, { "type": "Button", "props": { "y": 1, "x": 7, "var": "_btnBack", "stateNum": 1, "skin": "menu/btn_back.png" } }, { "type": "Image", "props": { "y": 9, "x": 134, "skin": "menu/img_title_1.png" } }, { "type": "List", "props": { "y": 95, "x": 10, "width": 1142, "var": "_list", "vScrollBarSkin": "comp/blank.png", "spaceY": 28, "spaceX": 28, "height": 545 } }, { "type": "Button", "props": { "y": 110, "x": 10, "var": "_btnSortNormal", "skin": "comp/button.png", "scaleY": 2, "scaleX": 2, "right": 20, "label": "全" } }, { "type": "Button", "props": { "y": 190, "x": 10, "var": "_btnSortCamp", "skin": "comp/button.png", "scaleY": 2, "scaleX": 2, "right": 20, "label": "阵营" } }] };
            return CardPackageUI;
        }(View));
        cardPackage.CardPackageUI = CardPackageUI;
    })(cardPackage = ui.cardPackage || (ui.cardPackage = {}));
})(ui || (ui = {}));
(function (ui) {
    var cardPackage;
    (function (cardPackage) {
        var SellCardUI = /** @class */ (function (_super) {
            __extends(SellCardUI, _super);
            function SellCardUI() {
                return _super.call(this) || this;
            }
            SellCardUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.cardPackage.SellCardUI.uiView);
            };
            SellCardUI.uiView = { "type": "View", "props": { "width": 1044, "height": 512 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "var": "_mask", "top": 0, "skin": "comp/blank.png", "right": 0, "mouseThrough": false, "mouseEnabled": true, "left": 0, "bottom": 0 } }, { "type": "Box", "props": { "var": "_boxNormal", "centerY": 0, "centerX": 0 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "menu/img_2.png" } }, { "type": "Button", "props": { "y": 10, "x": 945, "var": "_btnClose", "stateNum": 1, "skin": "menu/btn_close.png" } }, { "type": "Button", "props": { "y": 318, "x": 578, "var": "_btnConfirm", "stateNum": 1, "skin": "menu/btn_confirm.png" } }, { "type": "Image", "props": { "y": 153, "x": 463, "skin": "menu/img_1.png" } }, { "type": "TextInput", "props": { "y": 213, "x": 463, "width": 385, "var": "_input", "text": "TextInput", "skin": "menu/img_input.png", "restrict": "0-9", "padding": "0,10,0,10", "height": 58, "fontSize": 26, "color": "#ffffff" } }, { "type": "Label", "props": { "y": 286, "x": 463, "var": "_labTip", "text": "请输入金额", "fontSize": 16, "color": "#ff0400" } }, { "type": "Image", "props": { "y": 28, "skin": "menu/img_title_2.png", "centerX": 0 } }, { "type": "Image", "props": { "y": 127, "x": 139, "var": "_imgIcon", "skin": "cards/1.png" } }] }, { "type": "Box", "props": { "var": "_boxWaiting", "centerY": 0, "centerX": 0 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "menu/img_3.png" } }, { "type": "Label", "props": { "text": "正在交易中请等待", "fontSize": 30, "color": "#Ceb589", "centerY": 0, "centerX": 0 } }] }] };
            return SellCardUI;
        }(View));
        cardPackage.SellCardUI = SellCardUI;
    })(cardPackage = ui.cardPackage || (ui.cardPackage = {}));
})(ui || (ui = {}));
(function (ui) {
    var cards;
    (function (cards) {
        var CardUI = /** @class */ (function (_super) {
            __extends(CardUI, _super);
            function CardUI() {
                return _super.call(this) || this;
            }
            CardUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.cards.CardUI.uiView);
            };
            CardUI.uiView = { "type": "View", "props": { "width": 196, "height": 274 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "var": "_icon", "skin": "cards/1.png" } }, { "type": "Button", "props": { "y": 282, "visible": false, "stateNum": 1, "skin": "menu/btn_buy.png", "labelStrokeColor": "#000000", "labelStroke": 2, "labelSize": 20, "labelPadding": "-4,0,0,-20", "labelColors": "#ffffff", "label": "200", "centerX": 0 } }, { "type": "Image", "props": { "y": 30, "x": 30, "var": "_mask", "top": 0, "skin": "comp/blank.png", "right": 0, "mouseThrough": false, "mouseEnabled": true, "left": 0, "bottom": 0 } }] };
            return CardUI;
        }(View));
        cards.CardUI = CardUI;
    })(cards = ui.cards || (ui.cards = {}));
})(ui || (ui = {}));
(function (ui) {
    var exchange;
    (function (exchange) {
        var ExchangeViewUI = /** @class */ (function (_super) {
            __extends(ExchangeViewUI, _super);
            function ExchangeViewUI() {
                return _super.call(this) || this;
            }
            ExchangeViewUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.exchange.ExchangeViewUI.uiView);
            };
            ExchangeViewUI.uiView = { "type": "View", "props": { "width": 1280, "visible": true, "height": 720 }, "child": [{ "type": "Image", "props": { "y": 20, "x": 20, "var": "_mask", "top": 0, "skin": "comp/blank.png", "right": 0, "mouseThrough": false, "mouseEnabled": true, "left": 0, "bottom": 0 } }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "menu/bg.jpg" } }, { "type": "Button", "props": { "y": 1, "x": 7, "var": "_btnBack", "stateNum": 1, "skin": "menu/btn_back.png" } }, { "type": "Image", "props": { "y": 2, "x": 124, "skin": "menu/img_title_4.png" } }, { "type": "List", "props": { "y": 95, "x": 0, "width": 1142, "var": "_list", "vScrollBarSkin": "comp/blank.png", "spaceY": 28, "spaceX": 28, "height": 545 } }, { "type": "Tab", "props": { "y": 63, "width": 87, "var": "_tab", "right": 0 } }] };
            return ExchangeViewUI;
        }(View));
        exchange.ExchangeViewUI = ExchangeViewUI;
    })(exchange = ui.exchange || (ui.exchange = {}));
})(ui || (ui = {}));
(function (ui) {
    var scene;
    (function (scene) {
        var SceneLoginUI = /** @class */ (function (_super) {
            __extends(SceneLoginUI, _super);
            function SceneLoginUI() {
                return _super.call(this) || this;
            }
            SceneLoginUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.scene.SceneLoginUI.uiView);
            };
            SceneLoginUI.uiView = { "type": "View", "props": { "width": 600, "height": 720 }, "child": [{ "type": "Image", "props": { "skin": "login/img_bg.jpg", "centerY": 0, "centerX": 0 } }, { "type": "Button", "props": { "var": "_btnLogin", "stateNum": 1, "skin": "login/btn_guest.png", "centerX": 0, "bottom": 100 } }] };
            return SceneLoginUI;
        }(View));
        scene.SceneLoginUI = SceneLoginUI;
    })(scene = ui.scene || (ui.scene = {}));
})(ui || (ui = {}));
(function (ui) {
    var scene;
    (function (scene) {
        var SceneMenuUI = /** @class */ (function (_super) {
            __extends(SceneMenuUI, _super);
            function SceneMenuUI() {
                return _super.call(this) || this;
            }
            SceneMenuUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.scene.SceneMenuUI.uiView);
            };
            SceneMenuUI.uiView = { "type": "View", "props": { "width": 600, "height": 720 }, "child": [{ "type": "Image", "props": { "y": -160, "x": -480, "skin": "login/img_bg.jpg", "centerY": 0, "centerX": 0 } }, { "type": "Button", "props": { "y": 100, "var": "_btnWarehouse", "stateNum": 1, "skin": "menu/btn_2.png", "centerX": -526 } }, { "type": "Button", "props": { "y": 100, "var": "_btnCardPackage", "stateNum": 1, "skin": "menu/btn_3.png", "centerX": 499 } }, { "type": "Button", "props": { "y": 200, "var": "_btnShowcard", "stateNum": 1, "skin": "menu/btn_1.png", "centerX": -172 } }, { "type": "Button", "props": { "y": 200, "var": "_btnBankExchange", "stateNum": 1, "skin": "menu/btn_5.png", "centerX": 177 } }] };
            return SceneMenuUI;
        }(View));
        scene.SceneMenuUI = SceneMenuUI;
    })(scene = ui.scene || (ui.scene = {}));
})(ui || (ui = {}));
(function (ui) {
    var showcard;
    (function (showcard) {
        var ShowCardUI = /** @class */ (function (_super) {
            __extends(ShowCardUI, _super);
            function ShowCardUI() {
                return _super.call(this) || this;
            }
            ShowCardUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.showcard.ShowCardUI.uiView);
            };
            ShowCardUI.uiView = { "type": "View", "props": { "width": 600, "height": 720 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "var": "_mask", "top": 0, "skin": "comp/blank.png", "right": 0, "mouseThrough": false, "mouseEnabled": true, "left": 0, "bottom": 0 } }, { "type": "Image", "props": { "skin": "menu/bg_2.jpg", "centerY": 0, "centerX": 0 } }, { "type": "Image", "props": { "y": 20, "var": "_imgBg", "skin": "menu/img_4.png", "centerX": 0 } }, { "type": "Image", "props": { "y": 30, "x": 90, "var": "_imgIcon", "skin": "showcards/1.png", "centerX": 0 } }, { "type": "Button", "props": { "var": "_btnOpen", "stateNum": 1, "skin": "menu/btn_showcard.png", "centerX": 0, "bottom": 30 }, "child": [{ "type": "Label", "props": { "y": 30, "x": 79, "width": 35, "var": "_labCost", "text": "20", "height": 20, "fontSize": 20, "color": "#ffffff", "align": "center" } }] }, { "type": "Button", "props": { "y": 20, "x": 20, "var": "_btnBack", "stateNum": 1, "skin": "menu/btn_back.png" } }, { "type": "Label", "props": { "var": "_labTip", "text": "点击屏幕继续", "fontSize": 30, "color": "#Ceb589", "centerY": 280, "centerX": 0 } }, { "type": "Box", "props": { "y": 10, "x": 10, "var": "_boxWaiting", "centerY": 0, "centerX": 0 }, "child": [{ "type": "Image", "props": { "y": 0, "x": 0, "skin": "menu/img_3.png" } }, { "type": "Label", "props": { "var": "_wait", "text": "正在开卡中请等待", "fontSize": 30, "color": "#Ceb589", "centerY": 0, "centerX": 0 } }] }] };
            return ShowCardUI;
        }(View));
        showcard.ShowCardUI = ShowCardUI;
    })(showcard = ui.showcard || (ui.showcard = {}));
})(ui || (ui = {}));
(function (ui) {
    var warehouse;
    (function (warehouse) {
        var WarehouseUI = /** @class */ (function (_super) {
            __extends(WarehouseUI, _super);
            function WarehouseUI() {
                return _super.call(this) || this;
            }
            WarehouseUI.prototype.createChildren = function () {
                _super.prototype.createChildren.call(this);
                this.createView(ui.warehouse.WarehouseUI.uiView);
            };
            WarehouseUI.uiView = { "type": "View", "props": { "width": 1280, "visible": true, "height": 720 }, "child": [{ "type": "Image", "props": { "var": "_mask", "top": 0, "skin": "comp/blank.png", "right": 0, "mouseThrough": false, "mouseEnabled": true, "left": 0, "bottom": 0 } }, { "type": "Image", "props": { "y": 0, "x": 0, "skin": "menu/bg.jpg" } }, { "type": "Button", "props": { "y": 1, "x": 7, "visible": true, "var": "_btnBack", "stateNum": 1, "skin": "menu/btn_back.png" } }, { "type": "Image", "props": { "y": 9, "x": 134, "skin": "menu/img_title_1.png" } }, { "type": "List", "props": { "y": 95, "x": 0, "width": 1142, "var": "_list", "vScrollBarSkin": "comp/blank.png", "spaceY": 28, "spaceX": 28, "height": 545 } }, { "type": "Image", "props": { "y": 558, "skin": "menu/img_5.png", "right": 0 } }, { "type": "Tab", "props": { "y": 63, "width": 87, "var": "_tab", "right": 0 } }] };
            return WarehouseUI;
        }(View));
        warehouse.WarehouseUI = WarehouseUI;
    })(warehouse = ui.warehouse || (ui.warehouse = {}));
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map