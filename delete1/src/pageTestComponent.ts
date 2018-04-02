module pageTestComponent {
    export class ThisScene {
        private page: Laya.Box;
        constructor() {
            //容器组件（Box、 List、 Tab、RadioGroup、ViewStack、 Panel、HBox、VBox、Tree）默认无需对应资源，可以通过快捷键Ctrl+B进行转换而来
            this.page = new Laya.Box()
            var bg: Laya.Text = new Laya.Text()
            bg.bgColor = "#000000"
            bg.size(Laya.stage.width, Laya.stage.height)
            //button
            this.testButton()
            //ui组件除了Image和Clip外，用到的皮肤都需要提前预加载！
            var scaleBtn: Laya.Button = new ScaleButton()
            scaleBtn.label = "返回"
            scaleBtn.labelSize = 20
            scaleBtn.loadImage("res/img/chip.png", 0, 0, 50, 50, new Laya.Handler(this, function () { console.log() }))
            scaleBtn.pos(0, 0)
            scaleBtn.on(Laya.Event.CLICK, this, function () {
                this.page.removeSelf()
            })
            this.page.addChild(bg)
            this.page.addChild(scaleBtn)
            Laya.stage.addChild(this.page)
        }
        private testButton() {
            Laya.loader.load("comp/button.png", new Laya.Handler(this, function () {
                var btn1: Laya.Button = new ScaleButton("comp/button.png", "btn1")
                btn1.size(50, 50)
                btn1.pos(55, 0)
                btn1.labelSize = 20
                btn1.labelStroke = 2//文本描边宽度
                //StrokeColor颜色的先后设置顺序为格式: upColor（弹起或离开状态状态的颜色）,overColor（经过状态的颜色）,downColor（按下和选中状态的颜色）,disableColor（被禁止使用时的颜色）
                btn1.labelStrokeColor = "#ff0000#ff0000#ff0000#ff0000"
                this.page.addChild(btn1)
            }))
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