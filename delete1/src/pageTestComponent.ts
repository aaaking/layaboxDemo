module pageTestComponent {
    export class ThisScene {
        private page: Laya.Box;
        private resourcesStr = ["res/img/chip.png"
            , "comp/button.png"
            , "comp/combobox.png"
            , "comp/vscroll.png"
            , "comp/hscroll.png"
            , "res/atlas/number.atlas"]
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
            this.testList()
            this.testLabel()
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
            // Laya.timer.loop(100, this, function () { })
        }
        private testList() {
            var list: Laya.List = new Laya.List()
            list.pos(5, 55)
            list.itemRender = Item;
            list.repeatX = 1;
            list.repeatY = 10
            list.vScrollBarSkin = "comp/vscroll.png"
            list.selectEnable = true;
            list.selectHandler = null//new Handler(this, this.onSelect);
            list.renderHandler = new Laya.Handler(this, function (cell: Item, index: number) {
                cell.setImg(cell.dataSource);
            });
            // 设置数据项为对应图片的路径
            var data: Array<string> = [];
            for (var i: number = 0; i < 40; ++i) {
                data.push("" + i);
            }
            list.array = data;
            this.page.addChild(list)
        }
        private testLabel() {
            var panel: Laya.Panel = new Laya.Panel()
            panel.size(250, 250)
            panel.pos(500 + 17, 0)
            // panel.graphics.drawRect(0, 0, 250,  250, "#ffcccc");
            Laya.stage.addChild(panel)
            var mImg: Laya.Image = new Laya.Image("comp/image.png")
            panel.vScrollBarSkin = "comp/vscroll.png";
            panel.hScrollBarSkin = "comp/hscroll.png";
            mImg.size(mImg.width * 2, mImg.height * 2)
            panel.addChild(mImg)
        }
    }
    export class Item extends Laya.Box {
        public static WID: number = 373;
        public static HEI: number = 85;
        private img: Laya.Text;
        constructor() {
            super();
            this.size(Item.WID, Item.HEI);
            this.img = new Laya.Text();
            this.img.color = "#ff0000"
            this.img.fontSize = 20
            this.addChild(this.img);
        }
        public setImg(src: string): void {
            this.img.text = src;
        }
    }
    export class ScaleButton extends Laya.Button {
        constructor(skin: string = null, label: string = "") {
            super(skin, label)
            this.on(Laya.Event.MOUSE_DOWN, this, this.small)
            this.on(Laya.Event.MOUSE_UP, this, this.big)
            this.on(Laya.Event.MOUSE_OUT, this, this.big)
            // this.frameOnce(2, this, function () { })
            // this.frameLoop(2, this, function () {})
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