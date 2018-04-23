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
    //继承editorUI.Button 增加disabled下新纹理状态
    //disabled单独一图，命名为 "原文件名$.png"
    var State4Button = /** @class */ (function (_super) {
        __extends(State4Button, _super);
        function State4Button(skin, label) {
            if (skin === void 0) { skin = null; }
            if (label === void 0) { label = ""; }
            return _super.call(this, skin, label) || this;
            /* 设置按钮为单态按钮
            ** 取值：
            ** 1：单态。图片不做切割，按钮的皮肤状态只有一种。
            ** 2：两态。图片将以竖直方向被等比切割为2部分，从上向下，依次为弹起状态皮肤、按下和经过及选中状态皮肤。
            ** 3：三态。图片将以竖直方向被等比切割为2部分，从上向下，依次为弹起状态皮肤、经过状态皮肤、按下和选中状态皮肤
            */
        }
        Object.defineProperty(State4Button.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (value) {
                if (value != this._disabled) {
                    // if (value) {
                    //     if (!this._normalStateNum)
                    //         this._normalStateNum = this.stateNum;
                    //     this.skin = this._skin.replace(".png", "$.png");
                    //     this.stateNum = 1;
                    // }
                    // else {
                    //     this.skin = this._skin.replace("$.png", ".png");
                    //     this.stateNum = this._normalStateNum;
                    // }
                    this._disabled = value;
                    this.mouseEnabled = !value;
                }
            },
            enumerable: true,
            configurable: true
        });
        return State4Button;
    }(laya.editorUI.Button));
    component.State4Button = State4Button;
})(component || (component = {}));
//# sourceMappingURL=State4Button.js.map