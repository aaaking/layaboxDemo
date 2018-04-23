module component {
    /**
     * 缩放时间，单位为毫秒
     */
    var scaleTime: number = 100;
    /**
     * 缩放程度
     */
    var scaleValue: number = 1;
    //继承editorUI.Button
    export class ScaleButton extends BaseButton {
        /**
         * 缩放时间，单位为毫秒
         */
        public scaleTime: number = 100;
        /**
         * 缩放程度
         */
        public scaleValue: number = 1;
        constructor(skin: string = null, label: string = "") {
            super(skin, label);
            /* 设置按钮为单态按钮
            ** 取值：
            ** 1：单态。图片不做切割，按钮的皮肤状态只有一种。
            ** 2：两态。图片将以竖直方向被等比切割为2部分，从上向下，依次为弹起状态皮肤、按下和经过及选中状态皮肤。
            ** 3：三态。图片将以竖直方向被等比切割为2部分，从上向下，依次为弹起状态皮肤、经过状态皮肤、按下和选中状态皮肤
            */
            this.stateNum = 1;
            //添加鼠标按下事件侦听。按时时缩小按钮。
            this.on(Laya.Event.MOUSE_DOWN, this, this.scaleSmall);
            //添加鼠标抬起事件侦听。抬起时还原按钮。
            this.on(Laya.Event.MOUSE_UP, this, this.scaleBig);
            //添加鼠标离开事件侦听。离开时还原按钮。
            this.on(Laya.Event.MOUSE_OUT, this, this.scaleBig);
        }
        private scaleSmall(): void {
            //缩小至n的缓动效果 
            Laya.Tween.to(this, { scaleX: this.scaleValue, scaleY: this.scaleValue }, this.scaleTime);
            //播放按鈕音效
            SoundManager.instance.play(SoundConfig.SOUND_BTN_NORMAL);
        }
        private scaleBig(): void {
            //变大还原的缓动效果
            Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, scaleTime);
        }
    }
}