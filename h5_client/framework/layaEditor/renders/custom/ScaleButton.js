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
     * 缩放时间，单位为毫秒
     */
    var scaleTime = 100;
    /**
     * 缩放程度
     */
    var scaleValue = 1;
    //继承editorUI.Button
    var ScaleButton = (function (_super) {
        __extends(ScaleButton, _super);
        // /**
        //  * 缩放时间，单位为毫秒
        //  */
        // public scaleTime: number = 100;
        // /**
        //  * 缩放程度
        //  */
        // public scaleValue: number = 1;
        function ScaleButton(skin, label) {
            if (skin === void 0) { skin = null; }
            if (label === void 0) { label = ""; }
            var _this = _super.call(this, skin, label) || this;
            /* 设置按钮为单态按钮
            ** 取值：
            ** 1：单态。图片不做切割，按钮的皮肤状态只有一种。
            ** 2：两态。图片将以竖直方向被等比切割为2部分，从上向下，依次为弹起状态皮肤、按下和经过及选中状态皮肤。
            ** 3：三态。图片将以竖直方向被等比切割为2部分，从上向下，依次为弹起状态皮肤、经过状态皮肤、按下和选中状态皮肤
            */
            _this.stateNum = 1;
            //添加鼠标按下事件侦听。按时时缩小按钮。
            _this.on(Laya.Event.MOUSE_DOWN, _this, _this.scaleSmall);
            //添加鼠标抬起事件侦听。抬起时还原按钮。
            _this.on(Laya.Event.MOUSE_UP, _this, _this.scaleBig);
            //添加鼠标离开事件侦听。离开时还原按钮。
            _this.on(Laya.Event.MOUSE_OUT, _this, _this.scaleBig);
            return _this;
        }
        ScaleButton.prototype.scaleSmall = function () {
            //缩小至n的缓动效果 
            Laya.Tween.to(this, { scaleX: scaleValue, scaleY: scaleValue }, scaleTime);
            //播放按鈕音效
            // SoundManager.instance.play(SoundConfig.SOUND_BTN_NORMAL);
        };
        ScaleButton.prototype.scaleBig = function () {
            //变大还原的缓动效果
            Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, scaleTime);
        };
        return ScaleButton;
    }(laya.editorUI.Button));
    component.ScaleButton = ScaleButton;
})(component || (component = {}));
//# sourceMappingURL=ScaleButton.js.map