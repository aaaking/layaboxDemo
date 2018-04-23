/*
* @author seacole
* 倒计时的位图字体
*/
class TimerFont extends BPFont {
    constructor() {
        super();
    }

    private _time: number;
    private _needRemove: boolean;

    protected onAddToStage(e: Laya.Event): void {
        super.onAddToStage(e);
        this.pos(this._posX, this._posY);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.tweenSelf();
        Laya.timer.loop(1000, this, this.onTimer);
    }

    protected onRemoveFromStage(e: Laya.Event): void {
        super.onRemoveFromStage(e);
        Laya.Tween.clearTween(this);
        Laya.timer.clear(this, this.onTimer);
    }

    public setInfo(fontData: FontData): void {
        super.setInfo(fontData);
        this._time = Number(fontData.text);
        this._needRemove = fontData.needRemove;
    }

    private onTimer(): void {
        this._time--;
        this._time = this._time < 0 ? 0 : this._time;
        this.text = this._time.toString();
        this.tweenSelf();
        if (this._time <= 0) {
            Laya.Tween.clearTween(this);
            Laya.timer.clear(this, this.onTimer);
        }
        if (this._needRemove && this._time <= 0) {
            Dispatcher.dispatch(EventNames.REMOVE_FONT, this);
        }
    }

    private tweenSelf(): void {
        // this.scaleX = 0;
        // this.scaleY = 0;
        // Laya.Tween.clearTween(this);
        // Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 800, Laya.Ease.elasticOut);
    }

    public start(time: number): void {
        this.stop();
        this._time = time;
        this.text = this._time.toString();
        this.tweenSelf();
        Laya.timer.loop(1000, this, this.onTimer);
    }

    public stop(): void {
        Laya.Tween.clearTween(this);
        Laya.timer.clear(this, this.onTimer);
    }
}