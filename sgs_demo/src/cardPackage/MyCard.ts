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
        });
    }

    private onShowSellCards(data: any): void {
        SellCard.instance.show(this, data);
    }

    public updateBag(): void {
        CardPackageManager.instance.testInitCards(() => {
            this._list.array = CardPackageManager.instance.getCardsByCamp(this._tab.selectedIndex + 1);
        });
    }

    /***渲染单元格时的回调方法***/
    protected updateList(cell: WareHouseCard, index: number): void {
        cell.updata();
    }

    setList(camp: number): void {
        this._list.array = CardPackageManager.instance.getCardsByCamp(camp);
    }
}