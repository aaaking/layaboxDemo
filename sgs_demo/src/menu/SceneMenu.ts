module menu {
    export class SceneMenu extends Laya.View {
        circleToBottom = 88
        circleToRight = 98
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
            Dispatcher.on("userBalance", this, this.userBalance)
        }

        private userBalance(changeCount, callNet: boolean = true) {
            var balance = parseInt(localStorage.getItem("balance"))
            balance += changeCount
            localStorage.setItem("balance", balance + "")
            this._label.text = Utils.toNumberUnit(balance)
            if (callNet) {
                Ajax.callNet(GameConfig.RPC_URL, { "jsonrpc": "2.0", "method": Urls.eth_getBalance, "params": [localStorage.getItem("uuid"), "latest"], "id": 67 }, "POST", null, function (data) {
                    var balance = parseInt(parseInt(JSON.parse(data).result, 16).toString(10))
                    localStorage.setItem('balance', balance + "")
                    this._label.text = Utils.toNumberUnit(balance)
                }.bind(this))
            }
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
            var whiteSpace = (Laya.stage.width - UITools.MAX_BG_WIDTH) >> 1
            whiteSpace = whiteSpace <= 0 ? 0 : whiteSpace
            this._btnWarehouse.x = (Laya.stage.width) - this.circleToRight - whiteSpace

            this._btnCardPackage.on(Laya.Event.CLICK, this, this.onTouch);
            this._btnCardPackage.centerX = this._circleDis

            this._btnShowcard.on(Laya.Event.CLICK, this, this.onTouch);

            this._btnBankExchange.on(Laya.Event.CLICK, this, this.onTouch);
            this._btnBankExchange.centerX = -this._circleDis

            if (scale < 1) {
                // this._btnCardPackage.size(scale * this._btnCardPackage.width, scale * this._btnCardPackage.height)
                // this._btnShowcard.size(scale * this._btnShowcard.width, scale * this._btnShowcard.height)
                // this._btnBankExchange.size(scale * this._btnBankExchange.width, scale * this._btnBankExchange.height)
                // this._btnWarehouse.size(scale * this._btnWarehouse.width, scale * this._btnWarehouse.height)
            }

            //avator
            this.box.x = 15 + whiteSpace
            this._balanceBox.x = Laya.stage.width - this._balanceImg.width - 16 - whiteSpace

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
            this._btnWarehouse = new menu.MenuCard("menu/menu_wareHouse.png")
            var whiteSpace = (Laya.stage.width - UITools.MAX_BG_WIDTH) >> 1
            whiteSpace = whiteSpace <= 0 ? 0 : whiteSpace
            this._btnWarehouse.x = (Laya.stage.width) - this.circleToRight - whiteSpace
            this._btnWarehouse.y = Laya.stage.height - this.circleToBottom
            this.addChild(this._btnWarehouse)
        }

        box: Laya.Box
        private initAvator() {
            this.box = new Laya.Box()
            this.box.pos(15, 15)
            this.addChild(this.box)
            var image: Laya.Image = new Laya.Image("menu/menu_avator.png")
            this.box.addChild(image)
            var label: Laya.Label = new Laya.Label(localStorage.getItem('uuid'))
            label.fontSize = 20
            label.color = "#ffffff"
            label.pos(103, 20)
            this.box.addChild(label)
        }
        _balanceBox: Laya.Box
        _balanceImg: Laya.Image
        _label: Laya.Label
        private initBalance() {
            this._btnWarehouse = new menu.MenuCard("menu/menu_wareHouse.png")
            var whiteSpace = (Laya.stage.width - UITools.MAX_BG_WIDTH) >> 1
            this._balanceImg = new Laya.Image("menu/menu_icon_balance.png")
            this._balanceBox = new Laya.Box()
            this._balanceBox.pos(Laya.stage.width - this._balanceImg.width - 16 - whiteSpace, 40)
            this._balanceBox.size(this._balanceImg.width, this._balanceImg.height)
            this._balanceBox.addChild(this._balanceImg)
            this.addChild(this._balanceBox)
            this._label = new Laya.Label(Utils.toNumberUnit(parseInt(localStorage.getItem('balance'))))
            this._label.fontSize = 18
            this._label.color = "#ffffff"
            this._label.centerY = this._label.centerX = 0
            this._balanceBox.addChild(this._label)
        }
    }
}