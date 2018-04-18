/*
* name;
*/
class Warehouse extends CardList {
    static TITLE_Y_OFFSET = 0
    static STAR_TITLE_HEIGHT = 51 + Warehouse.TITLE_Y_OFFSET
    constructor() {
        super();
        this._pageName.skin = "menu/logo_cards_warehouse.png"
        // this.initStarTitle()
        this.listMouseAction()
        this.on(Laya.Event.MOUSE_DOWN, this, this.listMouseAction)
        this.on(Laya.Event.MOUSE_MOVE, this, this.listMouseAction)
        this.on(Laya.Event.MOUSE_UP, this, this.listMouseAction)
    }

    private static _instance: Warehouse;
    public static get instance(): Warehouse {
        if (!this._instance)
            this._instance = new Warehouse();
        return this._instance;
    }

    public show(parent: Laya.Sprite): void {
        if (parent && !Warehouse.instance.parent)
            parent.addChild(Warehouse.instance);

        WareHouseManager.instance.testInitCards(() => {
            this._list.itemRender = WareHouseCard;
            // this._list.scrollBar.elasticDistance = 20;
            this._list.scrollBar.visible = false;
            this._list.renderHandler = new Laya.Handler(this, this.updateList);
            // this._list.cacheContent = false
            this._list.array = WareHouseManager.instance._cards;
            // this._ui._list.array = ClubManager.myClubs;
            this._list.mouseHandler = new Laya.Handler(this, this.listMouseAction);
            this.onResize(null)
            // this.changeStarTitlePos()
        });
    }
    setList(camp: number): void {
        this._list.array = WareHouseManager.instance.getCardsByCamp(camp)
        this.listMouseAction()
    }

    /***渲染单元格时的回调方法***/
    protected updateList(cell: WareHouseCard, index: number): void {
        cell.updata();
    }

    // public _starTitles = []
    // private initStarTitle() {
    //     for (var i = 0; i < 10; i++) {
    //         var title: Laya.Text = new Laya.Text()
    //         title.text = (10 - i) + "星"
    //         title.fontSize = 30
    //         title.height = Warehouse.STAR_TITLE_HEIGHT
    //         title.valign = "middle"
    //         title.x = -(CardList.CARD_WIDTH >> 1)
    //         title.color = "#ff0000"
    //         title.zOrder = 1000
    //         this._starTitles.push(title)
    //         // this._list.addChild(title)
    //         this._list.getChildAt(0).addChild(title)
    //     }
    // }
    // private changeStarTitlePos() {
    //     var cardWithFillUp = Constants.getCardGroupByStar()
    //     var rows = 0
    //     var itemHeight = CardList.CARD_HEIGHT + CardList.LIST_SPACE
    //     for (var i = 0; i < this._starTitles.length; i++) {
    //         this._starTitles[i].y = rows * itemHeight - (CardList.CARD_HEIGHT >> 1)// + i * Warehouse.STAR_TITLE_HEIGHT
    //         rows += Math.ceil(cardWithFillUp[i].star.length / CardList._columeCount)
    //         // console.log("cardWithFillUp[i].star: " + cardWithFillUp[i].star.length + "  rows:" + rows)
    //     }
    // }

    _starTitle: Laya.Image
    private listMouseAction(p?: any) {
        if (!this._starTitle) {
            this._starTitle = new Laya.Image("star/title_10.png")
            this._starTitle.y = Warehouse.TITLE_Y_OFFSET
            this._list.addChild(this._starTitle)
        }
        if (!this._list.array || this._list.array.length <= this._list.startIndex) {
            return
        }
        var firstVisibleItem = (this._list.array[this._list.startIndex])
        if (firstVisibleItem) {
            this._starTitle.skin = "star/title_" + firstVisibleItem.star + ".png"
        }
    }
}