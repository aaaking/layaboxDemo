class TimeCircleView extends ui.shisanshui.TimeCircleUI{
    constructor(){
        super()
        this._mask = new Laya.Sprite();
        this._circle.mask = this._mask;
    }

   
    private _mask
    private _angle
    private _maxTime
    private _startTime
    private time
    private _lefttime
    public start(time: number = 15): void {
        this._angle = 0;
        this._maxTime = time;
        this.time = time
        this._lefttime = time
        this._startTime = Laya.Browser.now();
        this._mask.graphics.clear();
        Laya.timer.loop(100, this, this.onTimer);
        this.onTimer();
    }

    private onTimer(): void {
        this._lefttime = this._lefttime - 0.1
        this.time = Math.ceil(this._lefttime) > 0 ?  Math.ceil(this._lefttime) : 0
        this._time.text = String(this.time)
        var time: number = Laya.Browser.now();
        var multiple: number = (this._maxTime - this._lefttime) / this._maxTime;
        var angle = Math.min(360, multiple * 360);
        this.changeGraphics(angle);
        if (multiple >= 1) {
            this.stop();
        }
    }

    public stop() {
        Laya.timer.clear(this, this.onTimer);
    }

    private changeGraphics(angle: number): void {
        this._mask.graphics.clear();
        this._mask.graphics.drawPie(63.5, 63.5, 75, -90 + angle, 270, "#ffffff");
    }

    public clear(){
        Laya.timer.clearAll(this)
    }

}