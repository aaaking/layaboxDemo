class ScenePartice extends Laya.View {
    constructor() {
        super()
        var bg: Laya.Text = new Laya.Text()
        bg.bgColor = "#000000"
        bg.size(Laya.stage.width, Laya.stage.height)
        this.addChild(bg)
        var backBtn: Laya.Text = new Laya.Text()
        backBtn.fontSize = 30
        backBtn.text = "返回"
        backBtn.bold = true
        backBtn.color = "#ff0000"
        backBtn.pos(Laya.stage.width - 180, 10)
        backBtn.on("click", this, function () { this.removeSelf() })
        this.addChild(backBtn)
        Laya.stage.addChild(this)
        Laya.loader.load("myPartice1.part", Laya.Handler.create(this, this.particeLoaded), null, Laya.Loader.JSON)
    }
    private particeLoaded(settings: Laya.ParticleSetting) {
        var particle: Laya.Particle2D = new Laya.Particle2D(settings)
        particle.emitter.start()
        particle.play()
        particle.pos(Laya.stage.width >> 2, Laya.stage.height >> 2)
        this.addChild(particle)
    }
}