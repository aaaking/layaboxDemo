/*
* name;
*/
class Exchange extends ui.exchange.ExchangeViewUI {
    constructor() {
        super();
        this._mask.width = Laya.stage.width;
        this._mask.height = Laya.stage.height;
        this._mask.on(Laya.Event.CLICK, this, this.onTouch);
        this._btnBack.on(Laya.Event.CLICK, this, this.onTouch);
       
        Laya.stage.on(Laya.Event.RESIZE, this, this.onResize);

        this._tab.removeChildren();
        this._tab.initItems();
        for (var i: number = 0; i < 5; i++) {
            var btn: Laya.Button = new Laya.Button();
            btn.skin = "menu/btn_4.png";
            btn.stateNum = 2;
            btn.label = this._names[i];
            btn.labelColors = "#e2eff7,#e2eff7,#e2eff7,#e2eff7";
            btn.labelSize = 30;
            btn.name = "item" + i;
            this._tab.addItem(btn);
            btn.x = 0;
            btn.y = 99 * i;
        }
        this._tab.selectHandler = new Laya.Handler(this, this.checkTab);
        this._tab.selectedIndex=4;
        this.checkTab();
        Dispatcher.on("updateInfo",this,this.updateInfo);
    }
    private _names: Array<any> = ["魏", "蜀", "吴", "群", "全部"];

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

    private onTouch(e: Laya.Event): void {
        switch (e.currentTarget) {
            case this._btnBack:
                this.removeSelf();
                break;

            // case this._btnFilter0:
            //     this.setList(0);
            //     break;
            // case this._btnFilter1:
            //     this.setList(1);
            //     break;
            // case this._btnFilter2:
            //     this.setList(2);
            //     break;

            // case this._btnFilter3:
            //     this.setList(3);
            //     break;

            // case this._btnFilter4:
            //     this.setList(4);
            //     break;
        }
    }

    private setList(camp: number): void {
        this._list.array = ExchangeManager.instance.getCardsByCamp(camp);
    }

    /***渲染单元格时的回调方法***/
    protected updateList(cell: ExchangeCard, index: number): void {
        cell.updata();
    }

    private onResize(e: Laya.Event = null): void {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        var tmp: number = Math.floor((this.width - 190 - 196) / (196 + 28));
        this._list.width = (196 + 28) * tmp + 196;
        this._list.x = this.width - this._list.width >> 1;

    }

    private checkTab(): void {
         this.setList(this._tab.selectedIndex+1);
    }
}