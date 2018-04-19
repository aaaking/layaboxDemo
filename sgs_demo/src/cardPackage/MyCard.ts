class MyCard extends CardList {
    constructor() {
        super()
        Dispatcher.on("showSellCards", this, this.onShowSellCards);
        Dispatcher.on("updateBag", this, this.updateBag);
    }

    private static _instance: MyCard;
    public static get instance(): MyCard {
        if (!this._instance)
            this._instance = new MyCard();
        return this._instance;
    }
    public show(parent: Laya.Sprite): void {
        if (parent && !MyCard.instance.parent) {
            parent.addChild(MyCard.instance);
        }
        this._tab.selectedIndex = 4
        CardPackageManager.instance.testInitCards(() => {
            this._list.itemRender = CardPackageCard;
            // this._list.scrollBar.elasticDistance = 20;
            this._list.renderHandler = new Laya.Handler(this, this.updateList);
            this._list.array = CardPackageManager.instance.cards;
            // this._ui._list.array = ClubManager.myClubs;
            // this._list.mouseHandler = new Laya.Handler(this, this.selectList);
            this.onResize(null);
            this.judgeNullData()
        });
    }

    private onShowSellCards(data: any): void {
        SellCard.instance.show(this, data);
    }

    public updateBag(): void {
        CardPackageManager.instance.testInitCards(() => {
            this._list.array = CardPackageManager.instance.getCardsByCamp(this._tab.selectedIndex + 1);
            this.judgeNullData()
        });
    }

    /***渲染单元格时的回调方法***/
    protected updateList(cell: WareHouseCard, index: number): void {
        cell.updata();
    }

    setList(camp: number): void {
        this._list.array = CardPackageManager.instance.getCardsByCamp(camp);
        this.judgeNullData()
    }

    _emptyBox: Laya.Box
    judgeNullData() {
        if (this._list && this._list.array && this._list.array.length > 0) {
            if (this._emptyBox) {
                this._emptyBox.visible = false
            }
            return
        }
        if (!this._emptyBox) {
            this._emptyBox = new Laya.Box()
            this._emptyBox.size(UITools.canvasWidth, UITools.canvasHeight)
            this._emptyBox.centerX = -this._tab.width / 2
            this._emptyBox.centerY = -20
            this.addChild(this._emptyBox)
            //image
            var emptyImg: Laya.Image = new Laya.Image("icons/emptyPackage.png")
            emptyImg.centerX = emptyImg.centerY = 0
            this._emptyBox.addChild(emptyImg)
            //label
            var emptyLabel: Laya.Label = new Laya.Label("没有卡牌")
            emptyLabel.centerX = 0
            emptyLabel.centerY = emptyImg.height / 2 + emptyLabel.height / 2 + 10
            emptyLabel.fontSize = 24
            emptyLabel.color = "#ffffff"
            this._emptyBox.addChild(emptyLabel)
            //button
            var emptyButton: menu.MenuCard = new menu.MenuCard("icons/goOpenCard.png")
            emptyButton.stateNum = 2
            emptyButton.centerX = 0
            emptyButton.centerY = emptyLabel.centerY + emptyLabel.height / 2 + emptyButton.height / 2 + 10
            emptyButton.on(Laya.Event.CLICK, this, function () {
            })
            this._emptyBox.addChild(emptyButton)
        }
        this._emptyBox.visible = true
    }
}