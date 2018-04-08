class SceneViewPager extends Laya.View {
    constructor() {
        super()
        var bg: Laya.Text = new Laya.Text()
        bg.alpha = 0.6
        bg.size(Laya.stage.width, Laya.stage.height)
        bg.bgColor = "#000000"
        this.addChild(bg)
        var backBtn: Laya.Text = new Laya.Text()
        backBtn.fontSize = 30
        backBtn.text = "Back"
        backBtn.bold = true
        backBtn.color = "#ff0000"
        backBtn.pos(Laya.stage.width - 180, 10)
        backBtn.on("click", this, function () { this.removeSelf() })
        this.addChild(backBtn)
        Laya.stage.addChild(this)
    }
}