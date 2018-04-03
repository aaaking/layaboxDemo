/*
* name;
*/
class CardPackageCard extends Card {
    constructor() {
        super();

        this._labTest = new Laya.Label();
        this._labTest.centerX = 0;
        this._labTest.color = "#ff0000"
        this._labTest.y = 100;
        this.addChild(this._labTest);

        this._btnSell = new Laya.Button("menu/btn_sell.png");
        this._btnSell.stateNum = 1;
        this._btnSell.centerX = 0;
        this._btnSell.bottom = 0;
        this._btnSell.on(Laya.Event.CLICK, this, this.onTouch);
        this.addChild(this._btnSell);
        this._labCount = new Laya.Label();
        this._labCount.right = 20;
        this._labCount.bottom = 20;
        this._labCount.fontSize = 30;
        this._labCount.color = "#ffffff";
        this._labCount.stroke = 5;
        this._labCount.strokeColor = "0000000";
        this.addChild(this._labCount);
    }
     private _labCount: Laya.Label;
    private _labTest: Laya.Label;
    private _btnSell: Laya.Button;

    public updata(): void {
        super.updata();
        this._mask.visible = false
        if (this.dataSource) {
            this._labTest.text = this.dataSource.cfg.name;
            this._btnSell.visible = true;
        }
        else {
            this._labTest.text = "";
            this._btnSell.visible = false;
        }
        this._labCount.text = this.dataSource.count;
    }

    private onTouch(e:Laya.Event):void{
       Dispatcher.dispatch("showSellCards",this.dataSource);
    }

    // public updata(): void {
    //     super.updata();
    //     if (this.dataSource.isHave) {
    //         this._icon.skin = "cards/" + this.dataSource.cfg.icon + ".png";
    //         this._imgName.visible = false;
    //     }
    //     else {
    //         this._imgName.visible = true;
    //         this._imgName.skin = "cardsname/" + this.dataSource.cfg.icon + ".png";
    //         this._icon.skin = "cards/" + "0" + ".png";
    //     }
    //     this._labCount.text = this.dataSource.count;
    // }
}