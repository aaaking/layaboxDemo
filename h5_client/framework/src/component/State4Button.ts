module component {
    //继承editorUI.Button 增加disabled下新纹理状态
    //disabled单独一图，命名为 "原文件名$.png"
    export class State4Button extends BaseButton {
        private _normalStateNum: number;
        constructor(skin: string = null, label: string = "") {
            super(skin, label);

            /* 设置按钮为单态按钮
            ** 取值：
            ** 1：单态。图片不做切割，按钮的皮肤状态只有一种。
            ** 2：两态。图片将以竖直方向被等比切割为2部分，从上向下，依次为弹起状态皮肤、按下和经过及选中状态皮肤。
            ** 3：三态。图片将以竖直方向被等比切割为2部分，从上向下，依次为弹起状态皮肤、经过状态皮肤、按下和选中状态皮肤
            */

        }

        public set disabled(value: boolean) {
            if (value != this._disabled) {
                if (value) {
                    if (!this._normalStateNum)
                        this._normalStateNum = this.stateNum;
                    this.skin = this._skin.replace(".png", "$.png");
                    this.stateNum = 1;
                }
                else {
                    this.skin = this._skin.replace("$.png", ".png");
                    this.stateNum = this._normalStateNum;
                }
                this._disabled = value;
                this.mouseEnabled = !value;
            }
        }

        public get disabled(): boolean {
            return this._disabled;
        }
    }
}