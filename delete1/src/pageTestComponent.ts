module pageTestComponent {
    export class ThisScene {
        private page: Laya.Box;
        constructor() {
            this.page = new Laya.Box()
            var bg: Laya.Text = new Laya.Text()
            bg.bgColor = "#000000"
            bg.size(Laya.stage.width, Laya.stage.height)
            //ui组件除了Image和Clip外，用到的皮肤都需要提前预加载！
            var scaleBtn: Laya.Button = new ScaleButton()
            scaleBtn.size(100, 100)
            scaleBtn.label = "返回"
            scaleBtn.labelSize = 20
            scaleBtn.loadImage("res/img/chip.png")
            scaleBtn.pos(0, 0)
            scaleBtn.on(Laya.Event.CLICK, this, function () {
                this.page.removeSelf()
            })
            this.page.addChild(bg)
            this.page.addChild(scaleBtn)
            Laya.stage.addChild(this.page)
        }
    }
    export class ScaleButton extends Laya.Button {
        constructor(skin: string = null, label: string = "") {
            super(skin, label)
            this.on(Laya.Event.MOUSE_DOWN, this, this.small)
            this.on(Laya.Event.MOUSE_UP, this, this.big)
            this.on(Laya.Event.MOUSE_OUT, this, this.big)
        }
        private small() {
            Laya.Tween.to(this, {scaleX: 0.8, scaleY: 0.8}, 300)
        }
        private big() {
            Laya.Tween.to(this, {scaleX: 1, scaleY: 1}, 300)
        }
    }
    // new pageTestComponent.ThisScene()
}