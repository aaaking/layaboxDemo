/*
* name;
*/
class CardPackage extends ui.cardPackage.CardPackageUI {
    constructor() {
        super();
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);
        Dispatcher.on("showSellCards", this, this.onShowSellCards);
        Dispatcher.on("updateBag", this, this.updateBag);
        this.initBalance()
    }

    private static _instance: CardPackage;
    public static get instance(): CardPackage {
        if (!this._instance)
            this._instance = new CardPackage();
        return this._instance;
    }

    private _sortType: number;
    private _columeCount: number;

    public show(parent: Laya.Sprite): void {
        if (parent && !CardPackage.instance.parent)
            parent.addChild(CardPackage.instance);

        CardPackageManager.instance.testInitCards(() => {
            this._list.itemRender = CardPackageCard;
            // this._list.scrollBar.elasticDistance = 20;
            this._list.scrollBar.visible = false;
            this._list.renderHandler = new Laya.Handler(this, this.updateList);
            this._list.array = CardPackageManager.instance.cards;
            // this._ui._list.array = ClubManager.myClubs;
            // this._list.mouseHandler = new Laya.Handler(this, this.selectList);
            this.onResize(null);
        });


    }

    public updateBag(): void {
        CardPackageManager.instance.testInitCards(() => {
            this._list.array = CardPackageManager.instance.cards;
        });
    }

    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._btnBack:
                this.removeSelf();
                break;

            case this._btnSortNormal:
                this.setList(0);
                break;

            case this._btnSortCamp:
                this.setList(1);
                break;
        }
    }

    private setList(type: number): void {
        this._sortType = type;
        switch (this._sortType) {
            case 0:
                this._list.array = CardPackageManager.instance.cards;
                break;
            case 1:
                this.setCamp();
                break;
        }
    }

    private setCamp(): void {
        var camp: Array<any> = CardPackageManager.instance.sortOnCampCards;
        var currCamp: number = 1;
        var count: number = 0;
        var tmp: number;
        for (var i: number = 0; i < camp.length;) {
            if (camp[i].cfg.camp == currCamp) {
                count++;
                i++;
            } else {
                currCamp++;
                tmp = count % (this._columeCount + 1);
                if (tmp != 0)
                    tmp = this._columeCount + 1 - tmp;
                count = 0;
                for (var j: number = 0; j < tmp; j++ , i++) {
                    camp.splice(i, 0, null);
                }
            }
        }
        this._list.array = camp;
    }

    /***渲染单元格时的回调方法***/
    protected updateList(cell: CardPackageCard, index: number): void {
        cell.updata();
    }

    private onShowSellCards(data: any): void {
        SellCard.instance.show(this, data);
    }

    private initBalance() {
        var image: Laya.Image = new Laya.Image("menu/menu_icon_balance.png")
        var box: Laya.Box = new Laya.Box()
        box.pos(Laya.stage.width - image.width - 16, 16)
        box.size(image.width, image.height)
        box.addChild(image)
        this.addChild(box)
        var label: Laya.Label = new Laya.Label(Utils.toNumberUnit(parseInt(localStorage.getItem('balance'))))
        label.fontSize = 18
        label.color = "#ffffff"
        label.centerY = label.centerX = 0
        box.addChild(label)
    }

    private onResize(e: Laya.Event = null): void {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this._columeCount = Math.floor((this.width - 190 - 196) / (196 + 28));
        this._list.scrollBar.value = 0;
        this._list.width = (196 + 28) * this._columeCount + 196;
        this._list.x = this.width - this._list.width >> 1;
        this.setList(this._sortType);
        this._btnBack.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnSortNormal.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnSortCamp.on(Laya.Event.CLICK, this, this.onTouch);
        this.bg.centerX = this.bg.centerY = 0
    }
}