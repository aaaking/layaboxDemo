module pageTestComponent {
    export class ThisScene {
        private page: Laya.Box;
        private resourcesStr = ["res/img/chip.png"
            , "comp/button.png"
            , "comp/combobox.png"]
        constructor() {
            //容器组件（Box、 List、 Tab、RadioGroup、ViewStack、 Panel、HBox、VBox、Tree）默认无需对应资源，可以通过快捷键Ctrl+B进行转换而来
            this.page = new Laya.Box()
            var bg: Laya.Text = new Laya.Text()
            bg.bgColor = "#000000"
            bg.size(Laya.stage.width, Laya.stage.height)
            this.page.addChild(bg)
            Laya.loader.load(this.resourcesStr, new Laya.Handler(this, this.resourcesLoaded))
        }
        private resourcesLoaded() {
            //button
            this.testButton()
            //ui组件除了Image和Clip外，用到的皮肤都需要提前预加载！
            var scaleBtn: Laya.Button = new ScaleButton()
            scaleBtn.label = "返回"
            scaleBtn.labelSize = 20
            scaleBtn.loadImage("res/img/chip.png", 0, 0, 50, 50)
            scaleBtn.pos(0, 0)
            scaleBtn.on(Laya.Event.CLICK, this, function () {
                this.page.removeSelf()
            })
            this.page.addChild(scaleBtn)
            Laya.stage.addChild(this.page)
            this.testComboBox()
        }
        private testButton() {
            /* 设置按钮为单态按钮
            ** 取值：
            ** 1：单态。图片不做切割，按钮的皮肤状态只有一种。
            ** 2：两态。图片将以竖直方向被等比切割为2部分，从上向下，依次为弹起状态皮肤、按下和经过及选中状态皮肤。
            ** 3：三态。图片将以竖直方向被等比切割为2部分，从上向下，依次为弹起状态皮肤、经过状态皮肤、按下和选中状态皮肤
            */
            var btn1: Laya.Button = new ScaleButton("comp/button.png", "btn1")
            btn1.size(50, 50)
            btn1.pos(55, 0)
            btn1.labelSize = 20
            btn1.labelStroke = 2//文本描边宽度
            //StrokeColor颜色的先后设置顺序为格式: upColor（弹起或离开状态状态的颜色）,overColor（经过状态的颜色）,downColor（按下和选中状态的颜色）,disableColor（被禁止使用时的颜色）
            btn1.labelStrokeColor = "#ff0000#ff0000#ff0000#ff0000"
            this.page.addChild(btn1)
        }
        private testComboBox() {
            var comboBox: Laya.ComboBox = new Laya.ComboBox("comp/combobox.png", "item0, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item5, item1, item2, item3, item4, item225")
            comboBox.pos(110, 10)
            comboBox.selectHandler = null//Handler
            comboBox.visibleNum = 30
            comboBox.labelSize = 24;
            comboBox.itemSize = 12;
            this.page.addChild(comboBox)
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
            Laya.Tween.to(this, { scaleX: 0.8, scaleY: 0.8 }, 300)
        }
        private big() {
            Laya.Tween.to(this, { scaleX: 1, scaleY: 1 }, 300)
        }
    }
    // new pageTestComponent.ThisScene()
}