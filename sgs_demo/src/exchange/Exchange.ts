/*
* name;
*/
class Exchange extends CardList {
    constructor() {
        super();
        this._pageName.skin = "menu/logo_cards_exchange.png"
        Dispatcher.on("updateInfo",this,this.updateInfo);
    }

    private static _instance: Exchange;
    public static get instance(): Exchange {
        if (!this._instance)
            this._instance = new Exchange();
        return this._instance;
    }

    public show(parent: Laya.Sprite): void {
        if (parent && !Exchange.instance.parent)
            parent.addChild(Exchange.instance);

        ExchangeManager.instance.testInitCards(() => {
            this._list.itemRender = ExchangeCard;
            // this._list.scrollBar.elasticDistance = 20;
            this._list.scrollBar.visible = false;
            this._list.renderHandler = new Laya.Handler(this, this.updateList);
            this._list.array = ExchangeManager.instance.cards;
            // this._ui._list.array = ClubManager.myClubs;
            // this._list.mouseHandler = new Laya.Handler(this, this.selectList);
            this.onResize(null);
        });
    }

    public updateInfo(){
         ExchangeManager.instance.testInitCards(() => {
            this._list.array = ExchangeManager.instance.cards;         
        });
    }

    setList(camp: number): void {
        this._list.array = ExchangeManager.instance.getCardsByCamp(camp);
    }

    /***渲染单元格时的回调方法***/
    protected updateList(cell: ExchangeCard, index: number): void {
        cell.updata();
    }

    loading(success: boolean) {
        this._mask.visible = !success
    }
}