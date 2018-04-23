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
var component;
(function (component) {
    /**
     * 基础按钮控件，实现click监听事件
     */
    var BaseButton = /** @class */ (function (_super) {
        __extends(BaseButton, _super);
        function BaseButton(skin, label) {
            if (skin === void 0) { skin = null; }
            if (label === void 0) { label = ""; }
            var _this = _super.call(this, skin, label) || this;
            /**
            * 音效类型
            */
            _this.soundType = 1;
            return _this;
            // this.on(Laya.Event.CLICK, this, this.onTouch);
            // this.on(Laya.Event.DOUBLE_CLICK, this, this.onTouch);
        }
        return BaseButton;
    }(laya.editorUI.Button));
    component.BaseButton = BaseButton;
})(component || (component = {}));
//# sourceMappingURL=BaseButton.js.map