class Loading extends ui.loading.LoadingUI {
    // public _mask:Laya.Image;
    // 	public _loadingImg:Laya.Image;
    // 	public _loadingLabel:Laya.Label;
    // 	public _loadingBottomLabel:Laya.Label;
    // 	public _loadingTopLabel:Laya.Label;
    constructor() {
        super()
    }

    private static _instance: Loading;
    public static get instance(): Loading {
        if (!this._instance)
            this._instance = new Loading();
        return this._instance;
    }

    public show(topStr?: string, bottomStr?: string): void {
        Laya.stage.addChild(this);
        this.onResize(null);
        this.showAnim(true)
    }
    public hide() {
        this.showAnim(false)
        this.removeSelf()
    }

    private onResize(e: Laya.Event = null): void {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this._mask.on(Laya.Event.CLICK, this, this.onTouch)
    }

    private onTouch(e: Laya.Event): void {
    }

    showAnim(show: boolean) {
        if (show) {
            var costSeconds = 0
            Laya.timer.loop(70, this, () => {
                this._loadingImg.rotation += 10
            })
            Laya.timer.loop(1000, this, () => {
                costSeconds += 1
                var minute = Math.floor(costSeconds / 60).toString()
                if (minute.length == 1) {
                    minute = "0" + minute
                }
                var second = Math.floor(costSeconds % 60).toString()
                if (second.length == 1) {
                    second = "0" + second
                }
                this._loadingLabel.text = minute + ":" + second
            })
        } else {
            Laya.timer.clearAll(this)
        }
    }
}