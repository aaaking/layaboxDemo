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
    var BasePlayer = /** @class */ (function (_super) {
        __extends(BasePlayer, _super);
        function BasePlayer() {
            return _super.call(this) || this;
            //    this.addChild(new ui.components.table.PlayerViewUI)
        }
        return BasePlayer;
    }(laya.editorUI.View));
    component.BasePlayer = BasePlayer;
})(component || (component = {}));
//# sourceMappingURL=BasePlayer.js.map