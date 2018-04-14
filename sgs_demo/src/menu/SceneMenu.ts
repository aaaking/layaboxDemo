module menu {
    export class SceneMenu extends Laya.View {
        _preWidth = UITools.canvasWidth
        _yPos = 335//卡片中心距离顶部的距离
        _circleDis = 435//相邻卡片的中心距离
        _btnShowcard: Laya.Button
        _btnWarehouse: Laya.Button
        _btnCardPackage: Laya.Button
        _btnBankExchange: Laya.Button
        static _skinOpenCard: string = "menu/menu_openCard.png"
        static _skinMyCard: string = "menu/menu_myCard.png"
        static _skinExchange: string = "menu/menu_exchange.png"
        static bgMenu: string = "menu/img_bg.jpg"
        static BG: string = "menu/bg.jpg"
        static BG2: string = "menu/bg_2.jpg"
        static cards_bottom: string = "menu/cards_bottom.png"
        private constructor() {
            super()
            Laya.stage.addChild(this);
            this.initAvator()
            this.initBalance()
            this.initOpenCard()
            this.initExchangeCard()
            this.initMyCard()
            this.initWareHouseCard()
            this.onResize();
            Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
            CardPackageManager.instance.testInitCards(function () {
            })
            console.log(DebugUtil.debugMode)
        }

        private static _instance: menu.SceneMenu;
        public static get instance(): menu.SceneMenu {
            if (!this._instance)
                this._instance = new menu.SceneMenu();
            return this._instance;
        }

        private onResize(e: Laya.Event = null): void {
            var scale = Laya.stage.width / this._preWidth
            this._circleDis = this._circleDis + (Laya.stage.width - this._preWidth >> 2)
            this.width = Laya.stage.width;
            this.height = Laya.stage.height;
            this._btnWarehouse.on(Laya.Event.CLICK, this, this.onTouch);
            // this._btnWarehouse.x = this._btnWarehouse.x + Laya.stage.width - this._preWidth//(Laya.stage.width - this._preWidth >> 1)

            this._btnCardPackage.on(Laya.Event.CLICK, this, this.onTouch);
            this._btnCardPackage.centerX = this._circleDis

            this._btnShowcard.on(Laya.Event.CLICK, this, this.onTouch);

            this._btnBankExchange.on(Laya.Event.CLICK, this, this.onTouch);
            this._btnBankExchange.centerX = -this._circleDis

            if (scale < 1) {
                this._btnCardPackage.size(scale * this._btnCardPackage.width, scale * this._btnCardPackage.height)
                this._btnShowcard.size(scale * this._btnShowcard.width, scale * this._btnShowcard.height)
                this._btnBankExchange.size(scale * this._btnBankExchange.width, scale * this._btnBankExchange.height)
                this._btnWarehouse.size(scale * this._btnWarehouse.width, scale * this._btnWarehouse.height)
            }

            this._preWidth = Laya.stage.width
            //resize的时候可以刷新view，不用像上面这么麻烦，但是刷新比较耗性能
            // window.location.reload();
        }

        private onTouch(e: Laya.Event): void {
            switch (e.currentTarget) {
                case this._btnWarehouse:
                    Warehouse.instance.show(this);
                    break;
                case this._btnCardPackage:
                    MyCard.instance.show(this);
                    break;
                case this._btnShowcard:
                    ShowCard.instance.show(this);
                    break;
                case this._btnBankExchange:
                    Exchange.instance.show(this);
                    break;
            }
        }
        private initOpenCard() {
            this._btnShowcard = new menu.MenuCard(menu.SceneMenu._skinOpenCard)
            this._btnShowcard.y = this._yPos
            this._btnShowcard.centerX = 0
            this.addChild(this._btnShowcard)
        }
        private initExchangeCard() {
            this._btnBankExchange = new menu.MenuCard(menu.SceneMenu._skinExchange)
            this._btnBankExchange.y = this._yPos
            this._btnBankExchange.centerX = -this._circleDis
            this.addChild(this._btnBankExchange)
        }
        private initMyCard() {
            this._btnCardPackage = new menu.MenuCard(menu.SceneMenu._skinMyCard)
            this._btnCardPackage.y = this._yPos
            this._btnCardPackage.centerX = this._circleDis
            this.addChild(this._btnCardPackage)
        }
        private initWareHouseCard() {
            var circleToBottom = 88
            var circleToRight = 98
            this._btnWarehouse = new menu.MenuCard("menu/menu_wareHouse.png")
            this._btnWarehouse.x = Laya.stage.width - circleToRight
            this._btnWarehouse.y = Laya.stage.height - circleToBottom
            this.addChild(this._btnWarehouse)
        }
        private initAvator() {
            var box: Laya.Box = new Laya.Box()
            box.pos(15, 15)
            this.addChild(box)
            var image: Laya.Image = new Laya.Image("menu/menu_avator.png")
            box.addChild(image)
            var label: Laya.Label = new Laya.Label(localStorage.getItem('uuid'))
            label.fontSize = 20
            label.color = "#ffffff"
            label.pos(103, 20)
            box.addChild(label)
        }
        private initBalance() {
            var image: Laya.Image = new Laya.Image("menu/menu_icon_balance.png")
            var box: Laya.Box = new Laya.Box()
            box.pos(Laya.stage.width - image.width - 16, 40)
            box.size(image.width, image.height)
            box.addChild(image)
            this.addChild(box)
            var label: Laya.Label = new Laya.Label(Utils.toNumberUnit(parseInt(localStorage.getItem('balance'))))
            label.fontSize = 18
            label.color = "#ffffff"
            label.centerY = label.centerX = 0
            box.addChild(label)
        }
    }
}