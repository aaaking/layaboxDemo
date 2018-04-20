class CardList extends ui.cards.BaseCardListUI {
    static LIST_SPACE = 25
    static CARD_WIDTH = 184//196
    static CARD_HEIGHT = 243//274
    static _columeCount: number = 5
    static TAB_RIGHT = 36
    static BALANCE_RIGHT = 63
    constructor() {
        super()
        this._list.scrollBar.visible = false;
        this.initBackBtn()
        this.initBalance()
        this.initTab()
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
    }

    private initBackBtn() {
        var whiteSpace = (Laya.stage.width - UITools.MAX_BG_WIDTH) >> 1
        whiteSpace = whiteSpace <= 0 ? 0 : whiteSpace
        this._pageName.x = 163 + whiteSpace
        this._btnBack.anchorX = this._btnBack.anchorY = 0.5
        this._btnBack.x = (this._btnBack.width >> 1) + whiteSpace
        this._btnBack.y = this._btnBack.y + (this._btnBack.height >> 1)
    }

    _balanceBox: Laya.Box
    _balanceImg: Laya.Image
    _label: Laya.Label
    private initBalance() {
        var whiteSpace = (Laya.stage.width - UITools.MAX_BG_WIDTH) >> 1
        whiteSpace = whiteSpace <= 0 ? 0 : whiteSpace
        this._balanceImg = new Laya.Image("menu/menu_icon_balance.png")
        this._balanceBox = new Laya.Box()
        this._balanceBox.pos(Laya.stage.width - this._balanceImg.width - CardList.BALANCE_RIGHT - whiteSpace, 16)
        this._balanceBox.size(this._balanceImg.width, this._balanceImg.height)
        this._balanceBox.addChild(this._balanceImg)
        this.addChild(this._balanceBox)
        this._label = new Laya.Label(Utils.toNumberUnit(parseInt(localStorage.getItem('balance'))))
        this._label.fontSize = 18
        this._label.color = "#ffffff"
        this._label.centerY = this._label.centerX = 0
        this._balanceBox.addChild(this._label)
    }

    onResize(e: Laya.Event = null): void {
        var whiteSpace = (Laya.stage.width - UITools.canvasWidth) >> 1
        whiteSpace = whiteSpace <= 0 ? 0 : whiteSpace
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this._mask.on(Laya.Event.CLICK, this, this.onTouch)
        this._mask.zOrder = 10
        this._list.width = this.width - 10 - 10 - 20 - this._tab.width - 100 - (whiteSpace << 1)
        CardList._columeCount = 5//Math.floor(this._list.width / (MyCard.CARD_WIDTH + MyCard.LIST_SPACE));
        this._list.width = CardList._columeCount * (MyCard.CARD_WIDTH + MyCard.LIST_SPACE) - MyCard.LIST_SPACE
        this._list.scrollBar.value = 0;
        var oneRowCardWidth = (MyCard.CARD_WIDTH + MyCard.LIST_SPACE) * CardList._columeCount
        var remain = this._list.width - oneRowCardWidth
        console.log("this._list.width:" + this._list.width + "  oneRowCardWidth:" + oneRowCardWidth + "  this._list.repeatX:" + this._list.repeatX)
        this._list.x = (this.width - this._tab.width - CardList.TAB_RIGHT) - this._list.width + remain >> 1;
        this._btnBack.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnBack.on(Laya.Event.MOUSE_DOWN, this, menu.MenuCard.normalSmall, [this._btnBack]);
        this._btnBack.on(Laya.Event.MOUSE_UP, this, menu.MenuCard.normalBig, [this._btnBack]);
        this._btnBack.on(Laya.Event.MOUSE_OUT, this, menu.MenuCard.normalBig, [this._btnBack]);
        if (!this._list.array || this._list.array.length <= 0 || this._list.repeatX != CardList._columeCount) {//只针对“图鉴”页
            this._list.repeatX = CardList._columeCount
            WareHouseManager.instance._originalCards = (Constants.concatListBeforeFill())//原始数据
            Constants.fillUp()
            WareHouseManager.instance._cards = Constants.concatListAfterFill()//补充空数据后的集合
            console.info(WareHouseManager.instance._originalCards)
            console.info(WareHouseManager.instance._cards);
            // this._list.y = this._list.y - 800;
            // (this._list.getChildAt(0) as Laya.Box).y = (this._list.getChildAt(0) as Laya.Box).y + 800
            // console.log("list height: " + this._list.height + "   this._list.box height:" + (this._list.getChildAt(0) as Laya.Box).height)
            // this._list.setContentSize(this._list.width, this._list.height * 2.5 + 800)
            this._list.array = WareHouseManager.instance._cards;
        } else {
            this._list.repeatX = CardList._columeCount
        }
        this.setList(this._tab.selectedIndex + 1)
        
        //update x pos
        this._btnBack.x = (this._btnBack.width >> 1) + whiteSpace
        this._pageName.x = 163 + whiteSpace
        this._balanceBox.x = Laya.stage.width - this._balanceImg.width - CardList.BALANCE_RIGHT - whiteSpace
        this._tab.right = CardList.TAB_RIGHT + whiteSpace
    }

    private initTab() {
        var whiteSpace = (Laya.stage.width - UITools.canvasWidth) >> 1
        whiteSpace = whiteSpace <= 0 ? 0 : whiteSpace
        this._tab.removeChildren();
        this._tab.initItems();
        this._tab.right = CardList.TAB_RIGHT + whiteSpace
        for (var i: number = 0; i < 5; i++) {
            var btn: Laya.Button = new menu.MenuCard("menu/icon_camp_" + (i + 1) + ".png");
            btn.anchorX = btn.anchorY = 0.5
            btn.stateNum = 2;
            btn.labelColors = "#e2eff7,#e2eff7,#e2eff7,#e2eff7";
            btn.labelSize = 30;
            btn.name = "item" + i;
            this._tab.addItem(btn);
            btn.x = btn.width >> 1
            btn.y = (btn.height) * i + (btn.height >> 1)
        }
        this._tab.selectHandler = new Laya.Handler(this, this.checkTab);
        this._tab.selectedIndex = 4
        this.checkTab();
    }

    private checkTab(p?: any): void {//p == this._tab.selectedIndex
        this.setList(this._tab.selectedIndex + 1);
    }

    setList(camp: number): void {
    }

    onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._btnBack:
                Dispatcher.off("userBalance", this, this.userBalance)
                Dispatcher.off("updateInfo", this, this.updateInfo)
                this._list.array = null
                this.removeSelf();
                break;
        }
    }

    public updateInfo() {
    }

    userBalance(changeCount, callNet: boolean = true) {
        console.log("changeCount: " + changeCount)
        var balance = parseInt(localStorage.getItem("balance"))
        balance += changeCount
        localStorage.setItem("balance", balance + "")
        this._label.text = Utils.toNumberUnit(balance)
    }
}