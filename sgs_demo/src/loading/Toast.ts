class CommonDialog extends Laya.View {
    _bg: Laya.Image
    _txt: Laya.Label
    constructor(txt: string) {
        super()
        this._bg = new Laya.Image("menu/img_3.png")
        this._bg.centerX = this._bg.centerY = 0
        this.addChild(this._bg)
        this._txt = new Laya.Label(txt)
        this._txt.centerX = this._txt.centerY = 0
        this._txt.fontSize = 30
        this._txt.color = "#Ceb589"
        this.addChild(this._txt)
        this.centerX = this.centerY = 0
        Laya.stage.addChild(this)
        this.scale(0.2, 0.2)
        this.alpha = 0
        Laya.Tween.to(this, {scaleX: 1, scaleY: 1, alpha: 1}, 500, Laya.Ease.elasticOut, Laya.Handler.create(this, function() {
            Laya.timer.once(1000, this, function() {
                this.removeSelf()
            })
        }))
    }
}