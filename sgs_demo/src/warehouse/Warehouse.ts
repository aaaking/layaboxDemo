/*
* name;
*/
class Warehouse extends CardList {
    constructor() {
        super();
        this._pageName.skin = "menu/logo_cards_warehouse.png"
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
            this._list.array = WareHouseManager.instance.cards;
            // this._ui._list.array = ClubManager.myClubs;
            // this._list.mouseHandler = new Laya.Handler(this, this.selectList);
            this.onResize(null);
        });
    }
    setList(camp: number): void {
        this._list.array = WareHouseManager.instance.getCardsByCamp(camp);
    }

    /***渲染单元格时的回调方法***/
    protected updateList(cell: WareHouseCard, index: number): void {
        cell.updata();
    }
}