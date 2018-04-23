/*
* @author seacole
*遮罩
*/
class PanelMask extends Laya.Sprite {
    constructor() {
        super();
    }

    private _lastWidth: number;
    private _lastHeight: number;
    public reset(): void {
        if (this._lastWidth == AppControl.getInstance().stage.width && this._lastHeight == AppControl.getInstance().stage.height) {

        }
        else {
            this._lastWidth = AppControl.getInstance().stage.width;
            this._lastHeight = AppControl.getInstance().stage.height;
            this.graphics.clear();
            this.graphics.drawRect(0, 0, AppControl.getInstance().stage.width, AppControl.getInstance().stage.height, "#000000", "#000000", 1);
            this.alpha = 0.7;
        }

    }
}