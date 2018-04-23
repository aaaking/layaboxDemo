/*
* @author seacole
* 语音提示
*/
class RecordUI extends ui.components.table.RecordUI {
    constructor() {
        super();
        this.centerX = 0;
        this.centerY = -16;
        this.stop();
        this._mask = new Laya.Sprite();
        this._circle.mask = this._mask;
    }

    private _mask: Laya.Sprite;
    private _angle: number = 0;
    private _startTime: number;
    private _maxTime: number;
    public show(): void {
        if (!this.parent)
            AppControl.getInstance().addToPopup(this);
        this._mask.graphics.clear();
    }

    public start(time: number = 15000): void {
        this.tweenSelf();
        this._angle = 0;
        this._maxTime = time;
        this._startTime = Laya.Browser.now();
        Laya.timer.loop(100, this, this.onTimer);
        this.onTimer();
    }

    private tweenSelf(): void {
        this.ani1.play(1, true);
    }

    public stop(): number {
        this.ani1.gotoAndStop(1);
        this.ani1.stop();
        this.removeSelf();
        this.upShow = true;
        Laya.timer.clear(this, this.onTimer);

        return Laya.Browser.now() - this._startTime;
    }

    public set upShow(value: boolean) {
        this._imgUp.visible = value;
        if (value)
            this._imgCancel.visible = false;
    }

    public set cancelShow(value: boolean) {
        this._imgCancel.visible = value;
        if (value)
            this._imgUp.visible = false;
    }

    private onTimer(): void {
        var time: number = Laya.Browser.now();
        var multiple: number = (time - this._startTime) / this._maxTime;
        var angle = Math.min(360, multiple * 360);
        this.changeGraphics(angle);
        if (multiple >= 1) {
            this.stop();
            RecordManager.instance.stopRecord(true,BaseGameData.selfSeatid,GameLogic.selfData.nickname,15000);
        }
    }

    private changeGraphics(angle: number): void {
        this._mask.graphics.clear();
        this._mask.graphics.drawPie(63.5, 63.5, 75, -90 + angle, 270, "#ffffff");
    }
}