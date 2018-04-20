class Loading extends ui.loading.LoadingUI {
    templet: Laya.Templet
    constructor() {
        super()
        this.visible = false
        this._mask.width = UITools.MAX_BG_PIC_WIDTH
        this.templet = new Laya.Templet();
        this.templet.on(Laya.Event.COMPLETE, this, this.parseComplete);
        this.templet.on(Laya.Event.ERROR, this, this.onError);
        this.templet.loadAni("spine/999.sk")
    }
    mCurrIndex = 0
    skeletonI: Laya.Skeleton
    skeletonContainer: Laya.View
    parseComplete() {
        var whiteSpace = (Laya.stage.width - UITools.MAX_BG_WIDTH) >> 1
        whiteSpace = whiteSpace <= 0 ? 0 : whiteSpace
        this.skeletonI = this.templet.buildArmature(0)
        // this.skeletonI.pos(510 + whiteSpace, 490);
        this.skeletonI.showSkinByIndex(0);
        this.skeletonI.play("wak", true);
        this.skeletonI.scale(0.55, 0.55)
        let bound: Laya.Rectangle = this.skeletonI.getBounds()
        this.skeletonI.hitArea = bound
        console.log(bound)
        //spine parent
        this.skeletonContainer = new Laya.View()
        this.skeletonContainer.centerX = -145
        this.skeletonContainer.centerY = 120
        //矿山
        var mineImg: Laya.Image = new Laya.Image("icons/mine.png")
        mineImg.centerX = 70
        mineImg.centerY = 70
        this.addChild(mineImg)
        this.skeletonContainer.addChild(this.skeletonI)
        this.addChild(this.skeletonContainer)
        this.visible = true
    }
    onError() {
        console.log("hero detail parse error")
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